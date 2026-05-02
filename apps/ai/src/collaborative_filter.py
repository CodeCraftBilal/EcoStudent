import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def compute_collaborative_similarity(interactions_df):
    if interactions_df.empty:
        return None
        
    # Create user-item matrix
    user_item_matrix = interactions_df.pivot(index='userid', columns='productid', values='weight').fillna(0)
    
    if user_item_matrix.empty:
        return None
        
    # Item-item collaborative filtering similarity
    item_sim_matrix = cosine_similarity(user_item_matrix.T)
    
    return {
        'product_ids': user_item_matrix.columns.tolist(),
        'similarity_matrix': item_sim_matrix
    }

def get_collaborative_recommendations(user_id, interactions_df, collab_sim_data):
    if not collab_sim_data or interactions_df.empty:
        return pd.DataFrame()
        
    product_ids = collab_sim_data['product_ids']
    sim_matrix = collab_sim_data['similarity_matrix']
    
    # User interactions
    user_interactions = interactions_df[interactions_df['userid'] == user_id]
    if user_interactions.empty:
        return pd.DataFrame() # Cold start
        
    user_weights = dict(zip(user_interactions['productid'], user_interactions['weight']))
    
    scores = {}
    for i, pid in enumerate(product_ids):
        score = 0
        sum_sim = 0
        for interacted_pid, weight in user_weights.items():
            if interacted_pid in product_ids:
                j = product_ids.index(interacted_pid)
                sim = sim_matrix[i, j]
                score += sim * weight
                sum_sim += sim
                
        if sum_sim > 0:
            scores[pid] = score / sum_sim
            
    res_df = pd.DataFrame(list(scores.items()), columns=['productid', 'collab_score'])
    return res_df
