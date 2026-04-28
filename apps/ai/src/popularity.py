import pandas as pd
from sklearn.preprocessing import MinMaxScaler

def get_popularity_scores(products_df):
    if products_df.empty:
        return pd.DataFrame()
        
    df = products_df.copy()
    
    df['views'] = pd.to_numeric(df['views'], errors='coerce').fillna(0)
    df['viewcount'] = pd.to_numeric(df['viewcount'], errors='coerce').fillna(0)
    
    df['popularity'] = df['views'] + df['viewcount']
    
    if df['popularity'].max() > 0:
        scaler = MinMaxScaler()
        df['popularity_score'] = scaler.fit_transform(df[['popularity']])
    else:
        df['popularity_score'] = 0
        
    return df[['productid', 'popularity_score']]
