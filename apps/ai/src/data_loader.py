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
        p.views, p.viewcount, p.producttype, p.exchangetype, p.status,
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
