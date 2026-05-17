import torch
import io
from PIL import Image
from transformers import CLIPProcessor, CLIPModel

class CLIPEmbeddingService:
    def __init__(self, model_id: str = "openai/clip-vit-base-patch32"):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Loading CLIP model '{model_id}' on {self.device}...")
        self.model = CLIPModel.from_pretrained(model_id).to(self.device)
        self.processor = CLIPProcessor.from_pretrained(model_id)
        self.model.eval()

    def get_embedding(self, image_bytes: bytes) -> list[float]:
        """Extracts and normalizes the image embedding."""
        try:
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            inputs = self.processor(images=image, return_tensors="pt").to(self.device)
            
            with torch.no_grad():
                image_features = self.model.get_image_features(**inputs)
            
            # Normalize embedding for Cosine Similarity
            image_features = image_features / image_features.norm(p=2, dim=-1, keepdim=True)
            
            return image_features.squeeze(0).cpu().numpy().tolist()
        except Exception as e:
            print(f"Error processing image: {e}")
            raise e

# Singleton instance
clip_service = None

def get_clip_service():
    global clip_service
    if clip_service is None:
        clip_service = CLIPEmbeddingService()
    return clip_service
