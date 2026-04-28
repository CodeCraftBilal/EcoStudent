import pandas as pd
from .data_loader import get_products, get_users, get_interactions
from .content_filter import compute_content_similarity, get_content_recommendations
from .collaborative_filter import compute_collaborative_similarity, get_collaborative_recommendations
from .location_filter import get_location_scores
from .popularity import get_popularity_scores

# Global state for caching models
_cache = {}

def refresh_models():
    products_df = get_products()
    interactions_df = get_interactions()
    users_df = get_users()
    
    _cache['products_df'] = products_df
    _cache['interactions_df'] = interactions_df
    _cache['users_df'] = users_df
    _cache['content_sim'] = compute_content_similarity(products_df)
    _cache['collab_sim'] = compute_collaborative_similarity(interactions_df)
    _cache['popularity_scores'] = get_popularity_scores(products_df)
    print("Models refreshed successfully.")

def get_hybrid_recommendations(user_id: int, top_n: int = 10, weights=None):
    if not _cache:
        refresh_models()
        
    if weights is None:
        weights = {
            'content': 0.3,
            'collab': 0.3,
            'location': 0.2,
            'popularity': 0.2
        }
        
    products_df = _cache.get('products_df', pd.DataFrame())
    if products_df.empty:
        return {"userId": user_id, "recommendations": []}
        
    # Start with all products
    result_df = pd.DataFrame({'productid': products_df['productid']})
    
    # Get user interactions
    interactions_df = _cache.get('interactions_df', pd.DataFrame())
    if not interactions_df.empty:
        user_interactions = interactions_df[interactions_df['userid'] == user_id]
        target_products = user_interactions['productid'].tolist()
    else:
        target_products = []
    
    # 1. Content-based filtering scores
    content_scores = get_content_recommendations(
        target_products, 
        _cache.get('content_sim'), 
        products_df, 
        top_n=len(products_df)
    )
    
    # 2. Collaborative filtering scores
    collab_scores = get_collaborative_recommendations(
        user_id, 
        interactions_df, 
        _cache.get('collab_sim')
    )
    
    # 3. Location-based scores
    location_scores = get_location_scores(user_id, _cache.get('users_df', pd.DataFrame()), products_df)
    
    # 4. Popularity scores
    popularity_scores = _cache.get('popularity_scores', pd.DataFrame())
    
    # Merge all scores
    if not content_scores.empty:
        result_df = result_df.merge(content_scores, on='productid', how='left')
    else:
        result_df['content_score'] = 0
        
    if not collab_scores.empty:
        result_df = result_df.merge(collab_scores, on='productid', how='left')
    else:
        result_df['collab_score'] = 0
        
    if not location_scores.empty:
        result_df = result_df.merge(location_scores, on='productid', how='left')
    else:
        result_df['location_score'] = 0
        
    if not popularity_scores.empty:
        result_df = result_df.merge(popularity_scores, on='productid', how='left')
    else:
        result_df['popularity_score'] = 0
        
    # Fill NaN with 0
    result_df = result_df.fillna(0)
    
    # Filter out products the user owns
    user_owned = products_df[products_df['userid'] == user_id]['productid'].tolist()
    result_df = result_df[~result_df['productid'].isin(user_owned)]
    
    # Filter out products user already interacted with
    result_df = result_df[~result_df['productid'].isin(target_products)]
    
    # Calculate final score
    result_df['final_score'] = (
        weights['content'] * result_df['content_score'] +
        weights['collab'] * result_df['collab_score'] +
        weights['location'] * result_df['location_score'] +
        weights['popularity'] * result_df['popularity_score']
    )
    
    # Sort and get top N
    top_items = result_df.sort_values(by='final_score', ascending=False).head(top_n)
    
    # Format output
    recommendations = []
    for _, row in top_items.iterrows():
        pid = int(row['productid'])
        score = float(row['final_score'])
        
        # Determine reason
        reasons = []
        if row['content_score'] > 0.5: reasons.append("Similar to your interactions")
        if row['collab_score'] > 0.5: reasons.append("Users like you bought this")
        if row['location_score'] > 0.5: reasons.append("Nearby")
        if row['popularity_score'] > 0.8: reasons.append("Popular right now")
        
        reason = " and ".join(reasons) if reasons else "Recommended for you"
        
        recommendations.append({
            "productId": pid,
            "score": round(score, 3),
            "reason": reason
        })
        
    return {
        "userId": user_id,
        "recommendations": recommendations
    }
