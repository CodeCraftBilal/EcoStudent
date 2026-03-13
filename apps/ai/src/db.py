import os
from sqlalchemy import create_engine
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

# We pull DATABASE_URL from environment; default is provided for local testing
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:bilal@localhost:5432/ecostudent")

engine = create_engine(DATABASE_URL)

def get_db_engine():
    return engine

def fetch_data(query: str):
    """Utility to execute a SQL query and return a pandas DataFrame."""
    try:
        with engine.connect() as conn:
            df = pd.read_sql(query, conn)
            print(df)
        return df
    except Exception as e:
        print(f"Database error: {e}")
        return pd.DataFrame()
