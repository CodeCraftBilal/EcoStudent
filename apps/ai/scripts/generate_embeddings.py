import os
import requests
import psycopg2
from io import BytesIO
import sys

# Add parent directory to path so we can import from src
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from src.clip_service import get_clip_service
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

def main():
    if not DATABASE_URL:
        print("DATABASE_URL not found in .env")
        return

    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()

    # Find products without embeddings that have images
    cursor.execute("""
        SELECT productid, images 
        FROM product 
        WHERE embedding IS NULL AND images IS NOT NULL
    """)
    products = cursor.fetchall()
    
    print(f"Found {len(products)} products to process.")
    
    if len(products) == 0:
        return

    clip_service = get_clip_service()

    for pid, images_json in products:
        try:
            image_url = None
            if isinstance(images_json, list) and len(images_json) > 0:
                image_url = images_json[0]
            elif isinstance(images_json, str) and images_json.startswith('http'):
                image_url = images_json
                
            if not image_url or not isinstance(image_url, str):
                continue
                
            print(f"Processing Product {pid} with image {image_url}")
            
            # Fetch image from URL
            response = requests.get(image_url, timeout=10)
            response.raise_for_status()
            
            # Generate embedding
            embedding = clip_service.get_embedding(response.content)
            
            # Save to PostgreSQL
            cursor.execute(
                "UPDATE product SET embedding = %s WHERE productid = %s",
                (str(embedding), pid)
            )
            conn.commit()
            print(f"Successfully updated Product {pid}")

        except Exception as e:
            print(f"Failed to process Product {pid}: {e}")
            conn.rollback()

    cursor.close()
    conn.close()
    print("Batch processing complete.")

if __name__ == "__main__":
    main()
