import pandas as pd
import numpy as np

def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the great circle distance between two points 
    using the Spherical Law of Cosines.
    """
    if pd.isna(lat1) or pd.isna(lon1) or pd.isna(lat2) or pd.isna(lon2):
        return float('inf')
        
    try:
        # Convert to float
        lat1, lon1, lat2, lon2 = float(lat1), float(lon1), float(lat2), float(lon2)
        # Convert decimal degrees to radians 
        lat1_r, lon1_r, lat2_r, lon2_r = map(np.radians, [lat1, lon1, lat2, lon2])

        # Cosine formula
        val = np.sin(lat1_r) * np.sin(lat2_r) + np.cos(lat1_r) * np.cos(lat2_r) * np.cos(lon2_r - lon1_r)
        # Clip to avoid math domain errors
        val = np.clip(val, -1.0, 1.0)
        c = np.arccos(val)
        r = 6371 # Radius of earth in kilometers.
        return c * r
    except:
        return float('inf')

def get_location_scores(user_id, users_df, products_df, max_radius_km=10, override_lat=None, override_lon=None):
    if override_lat is not None and override_lon is not None:
        user_lat = float(override_lat)
        user_lon = float(override_lon)
    else:
        user_data = users_df[users_df['userid'] == user_id]
        if user_data.empty:
            return pd.DataFrame()
            
        user_lat = user_data.iloc[0]['latitude']
        user_lon = user_data.iloc[0]['longitude']
        
        if pd.isna(user_lat) or pd.isna(user_lon):
            return pd.DataFrame()
        
    seller_ids = products_df['userid'].unique()
    sellers_df = users_df[users_df['userid'].isin(seller_ids)].copy()
    
    if sellers_df.empty:
        return pd.DataFrame()
    
    # Calculate distance from user to sellers
    sellers_df['distance'] = sellers_df.apply(
        lambda row: calculate_distance(user_lat, user_lon, row['latitude'], row['longitude']), 
        axis=1
    )
    
    # Merge distance to products
    prod_locations = products_df[['productid', 'userid']].merge(
        sellers_df[['userid', 'distance']], 
        on='userid', 
        how='left'
    )
    
    # Score: closer is better. 
    # Max score 1 at 0km, 0 at >= max_radius_km
    prod_locations['location_score'] = np.where(
        prod_locations['distance'] <= max_radius_km,
        1 - (prod_locations['distance'] / max_radius_km),
        0
    )
    
    # If distance is NaN, score is 0
    prod_locations['location_score'] = prod_locations['location_score'].fillna(0)
    
    return prod_locations[['productid', 'location_score', 'distance']]
