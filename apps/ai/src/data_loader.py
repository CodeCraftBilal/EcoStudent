import os
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)

def get_products():
    query = """
    SELECT 
        p.productid, p.userid, p.categoryid, p.title, p.description, p.price, 
        p.viewcount, p.producttype, p.exchangetype, p.status,
        p.originalprice, p.productcondition, p.images,
        c.categoryname,
        u.username, u.rating, u.isverified, u.profilepicture
    FROM product p
    LEFT JOIN category c ON p.categoryid = c.categoryid
    LEFT JOIN users u ON p.userid = u.userid
    WHERE p.status = 'active'
    """
    try:
        return pd.read_sql(query, engine)
    except Exception as e:
        print(f"Error loading products: {e}")
        return pd.DataFrame()

def get_users():
    query = "SELECT userid, latitude, longitude FROM users"
    try:
        return pd.read_sql(query, engine)
    except Exception as e:
        print(f"Error loading users: {e}")
        return pd.DataFrame()

def get_interactions():
    fav_query = "SELECT userid, productid, 5 as weight FROM user_favorites"
    exc_query = "SELECT buyerid as userid, productid, 10 as weight FROM exchanges"
    rev_query = """
        SELECT r.reviewerid as userid, p.productid, r.rating as weight 
        FROM reviews r 
        JOIN exchanges e ON r.exchangeid = e.exchangeid 
        JOIN product p ON e.productid = p.productid
    """
    
    try:
        fav_df = pd.read_sql(fav_query, engine)
        exc_df = pd.read_sql(exc_query, engine)
        rev_df = pd.read_sql(rev_query, engine)
        
        df = pd.concat([fav_df, exc_df, rev_df], ignore_index=True)
        if not df.empty:
            df['weight'] = pd.to_numeric(df['weight'], errors='coerce').fillna(0)
            df = df.groupby(['userid', 'productid'])['weight'].sum().reset_index()
        else:
            df = pd.DataFrame(columns=['userid', 'productid', 'weight'])
        return df
    except Exception as e:
        print(f"Error loading interactions: {e}")
        return pd.DataFrame(columns=['userid', 'productid', 'weight'])

def get_filtered_products(filters):
    lat = filters.get('lat')
    lng = filters.get('lng')
    maxDistance = filters.get('maxDistance')
    
    where_clauses = ["p.status = 'active'"]
    params = {}
    
    categories = filters.get('category')
    if categories and len(categories) > 0 and categories[0] not in ('', 'all'):
        where_clauses.append("c.categoryname = ANY(:categories)")
        params['categories'] = list(categories)
        
    search_query = filters.get('searchQuery')
    if search_query:
        where_clauses.append("(LOWER(p.title) LIKE :search_query OR LOWER(p.description) LIKE :search_query)")
        params['search_query'] = f"%{search_query.lower()}%"
        
    min_price = filters.get('minPrice')
    if min_price is not None:
        where_clauses.append("p.price >= :min_price")
        params['min_price'] = float(min_price)
        
    max_price = filters.get('maxPrice')
    if max_price is not None:
        where_clauses.append("p.price <= :max_price")
        params['max_price'] = float(max_price)
        
    conditions = filters.get('condition')
    if conditions and len(conditions) > 0 and conditions[0] != '':
        where_clauses.append("p.productcondition = ANY(:conditions)")
        params['conditions'] = list(conditions)
        
    exchange_types = filters.get('exchangeType')
    if exchange_types and len(exchange_types) > 0 and exchange_types[0] != '':
        where_clauses.append("p.exchangetype = ANY(:exchange_types)")
        params['exchange_types'] = list(exchange_types)
        
    whereSQL = "WHERE " + " AND ".join(where_clauses)
    
    if lat is not None and lng is not None:
        # Prevent division by zero or errors by ensuring lat/lng are floats
        try:
            lat = float(lat)
            lng = float(lng)
            distance_col = f"""
            (6371 * acos(
               cos(radians({lat})) * cos(radians(u.latitude)) *
               cos(radians(u.longitude) - radians({lng})) +
               sin(radians({lat})) * sin(radians(u.latitude))
             ))
            """
        except ValueError:
            distance_col = "0"
    else:
        distance_col = "0"
    
    print(f'lat: ${lat} lng: ${lng}')
    sql = f"""
      SELECT *
      FROM (
        SELECT
          p.productid,
          p.title,
          p.description,
          p.images,
          p.price,
          p.originalprice,
          p.productcondition,
          p.exchangetype,
          p.created_at,
          p.updated_at,
          c.categoryname,
          u.username,
          u.isverified,
          COALESCE((SELECT AVG(rating) FROM reviews r WHERE r.revieweduserid = u.userid), 0) AS rating,
          u.profilepicture,
          u.userid,
          {distance_col} AS distance
        FROM product p
        LEFT JOIN category c ON p.categoryid = c.categoryid
        LEFT JOIN users u ON p.userid = u.userid
        {whereSQL}
      ) AS sub
    """
    
    if maxDistance is not None:
        try:
            max_d = float(maxDistance)
            sql += " WHERE sub.distance <= :max_distance"
            params['max_distance'] = max_d
        except ValueError:
            pass
            
    try:
        from sqlalchemy import text
        return pd.read_sql(text(sql), engine, params=params)
    except Exception as e:
        print(f"Error loading filtered products: {e}")
        return pd.DataFrame()
