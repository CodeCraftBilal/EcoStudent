import pandas as pd
import numpy as np


def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Vectorized Haversine distance (in kilometers).
    Works with scalars, NumPy arrays, or pandas Series.
    """

    lat1 = np.asarray(lat1, dtype=float)
    lon1 = np.asarray(lon1, dtype=float)
    lat2 = np.asarray(lat2, dtype=float)
    lon2 = np.asarray(lon2, dtype=float)

    # Mask invalid values
    mask = np.isnan(lat1) | np.isnan(lon1) | np.isnan(lat2) | np.isnan(lon2)

    # Convert to radians
    lat1 = np.radians(lat1)
    lon1 = np.radians(lon1)
    lat2 = np.radians(lat2)
    lon2 = np.radians(lon2)

    # Differences
    dlat = lat2 - lat1
    dlon = lon2 - lon1

    # Haversine formula
    a = np.sin(dlat / 2.0) ** 2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon / 2.0) ** 2
    a = np.clip(a, 0.0, 1.0)

    c = 2 * np.arcsin(np.sqrt(a))

    R = 6371.0  # Earth radius in KM
    distance = R * c

    # Assign infinity to invalid rows
    if isinstance(distance, np.ndarray):
        distance[mask] = np.inf
    elif mask:
        distance = np.inf

    return distance


def get_location_scores(user_id, users_df, products_df, max_radius_km=10, override_lat=None, override_lon=None):
    """
    Returns product location scores based on distance from user.
    Score = 1 (closest) → 0 (>= max_radius_km)
    """

    # Get user location
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

    # Get sellers from products
    seller_ids = products_df['userid'].unique()
    sellers_df = users_df[users_df['userid'].isin(seller_ids)].copy()

    if sellers_df.empty:
        return pd.DataFrame()

    # 🚀 FAST vectorized distance calculation
    sellers_df['distance'] = haversine_distance(
        user_lat,
        user_lon,
        sellers_df['latitude'],
        sellers_df['longitude']
    )

    # Optional: filter sellers within radius (performance boost)
    sellers_df = sellers_df[sellers_df['distance'] <= max_radius_km]

    if sellers_df.empty:
        return pd.DataFrame()

    # Merge distances into products
    prod_locations = products_df[['productid', 'userid']].merge(
        sellers_df[['userid', 'distance']],
        on='userid',
        how='left'
    )

    # Compute score
    prod_locations['location_score'] = np.where(
        prod_locations['distance'] <= max_radius_km,
        1 - (prod_locations['distance'] / max_radius_km),
        0
    )

    # Handle missing values
    prod_locations['location_score'] = prod_locations['location_score'].fillna(0)
    prod_locations['distance'] = prod_locations['distance'].fillna(np.inf)

    return prod_locations[['productid', 'location_score', 'distance']]