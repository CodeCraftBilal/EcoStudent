from transformers import CLIPModel, CLIPProcessor

model_id = "openai/clip-vit-base-patch32"

model = CLIPModel.from_pretrained(model_id)
processor = CLIPProcessor.from_pretrained(model_id)

model.save_pretrained("./models/clip-vit-base-patch32")
processor.save_pretrained("./models/clip-vit-base-patch32")

print("Model saved locally.")