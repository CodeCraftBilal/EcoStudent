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


def filter_products_by_distance(
    user_id, users_df, products_df,
    max_distance_km, override_lat=None, override_lon=None
):
    
    print("overide lat: ", override_lat, " override long: ", override_lon)
    """
    Hard-filter products by distance from user.
    Returns (filtered_products_df, distance_map) where:
      - filtered_products_df: products whose sellers are within max_distance_km
      - distance_map: dict of {productid: distance_in_km}
    If user location is unavailable, returns the original products with no distances.
    """

    # Resolve user location
    if override_lat is not None and override_lon is not None:
        user_lat = float(override_lat)
        user_lon = float(override_lon)
    else:
        user_data = users_df[users_df['userid'] == user_id]
        if user_data.empty:
            return products_df, {}

        user_lat = user_data.iloc[0]['latitude']
        user_lon = user_data.iloc[0]['longitude']

        if pd.isna(user_lat) or pd.isna(user_lon):
            return products_df, {}

    # Get unique sellers from products
    seller_ids = products_df['userid'].unique()
    sellers_df = users_df[users_df['userid'].isin(seller_ids)].copy()

    if sellers_df.empty:
        return products_df, {}

    # Vectorized distance calculation
    sellers_df['distance'] = haversine_distance(
        user_lat, user_lon,
        sellers_df['latitude'], sellers_df['longitude']
    )

    # Keep only sellers within the max distance
    nearby_sellers = sellers_df[sellers_df['distance'] <= max_distance_km]

    if nearby_sellers.empty:
        return pd.DataFrame(columns=products_df.columns), {}

    # Filter products to only those from nearby sellers
    filtered_df = products_df[products_df['userid'].isin(nearby_sellers['userid'])].copy()

    # Build a distance map: productid -> distance
    seller_distance = nearby_sellers.set_index('userid')['distance'].to_dict()
    distance_map = {
        row['productid']: seller_distance.get(row['userid'], 0.0)
        for _, row in filtered_df.iterrows()
    }

    return filtered_df, distance_map


def get_product_distances(user_id, users_df, products_df, override_lat=None, override_lon=None):
    """
    Compute distance from user to every product's seller (no filtering).
    Returns dict of {productid: distance_in_km}.
    Used to populate the distance field in responses when maxDistance filter is not set.
    """

    if override_lat is not None and override_lon is not None:
        user_lat = float(override_lat)
        user_lon = float(override_lon)
    else:
        user_data = users_df[users_df['userid'] == user_id]
        if user_data.empty:
            return {}

        user_lat = user_data.iloc[0]['latitude']
        user_lon = user_data.iloc[0]['longitude']

        if pd.isna(user_lat) or pd.isna(user_lon):
            return {}

    seller_ids = products_df['userid'].unique()
    sellers_df = users_df[users_df['userid'].isin(seller_ids)].copy()

    if sellers_df.empty:
        return {}

    sellers_df['distance'] = haversine_distance(
        user_lat, user_lon,
        sellers_df['latitude'], sellers_df['longitude']
    )

    seller_distance = sellers_df.set_index('userid')['distance'].to_dict()
    return {
        row['productid']: seller_distance.get(row['userid'], 0.0)
        for _, row in products_df.iterrows()
    }