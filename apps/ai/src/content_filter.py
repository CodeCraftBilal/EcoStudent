import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def compute_content_similarity(products_df: pd.DataFrame):
    if products_df.empty:
        return {}
        
    df = products_df.copy()
    df['title'] = df['title'].fillna('')
    df['description'] = df['description'].fillna('')
    df['producttype'] = df['producttype'].fillna('').astype(str)
    
    # Combine text features
    df['content'] = df['title'] + " " + df['description'] + " " + df['producttype']
    
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df['content'])
    
    # Compute cosine similarity
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    
    return {
        'product_ids': df['productid'].tolist(),
        'similarity_matrix': cosine_sim
    }

def get_content_recommendations(target_product_ids, content_sim_data, products_df, top_n=10):
    if not content_sim_data or not target_product_ids:
        return pd.DataFrame()
        
    product_ids = content_sim_data['product_ids']
    sim_matrix = content_sim_data['similarity_matrix']
    
    # Find indices of target products
    target_indices = [i for i, pid in enumerate(product_ids) if pid in target_product_ids]
    if not target_indices:
        return pd.DataFrame()
        
    # Get mean similarity for all target products
    mean_sim = np.mean(sim_matrix[target_indices], axis=0)
    
    # Map score to each product
    scores = [(product_ids[i], score) for i, score in enumerate(mean_sim)]
    
    # Return as dataframe
    res_df = pd.DataFrame(scores, columns=['productid', 'content_score'])
    return res_df
