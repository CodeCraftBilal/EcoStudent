"use client";

import { useState } from "react";
import { X, Upload, Camera } from "lucide-react";
import { UploadItemData } from "@/lib/types/dashboard/types";

interface UploadItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: UploadItemData) => void;
}

export default function UploadItemModal({ isOpen, onClose, onUpload }: UploadItemModalProps) {
  const [formData, setFormData] = useState<UploadItemData>({
    title: "",
    description: "",
    price: 0,
    category: "books",
    condition: "good",
    exchangeType: "sale",
    images: []
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, file]
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpload(formData);
    onClose();
    // Reset form
    setFormData({
      title: "",
      description: "",
      price: 0,
      category: "books",
      condition: "good",
      exchangeType: "sale",
      images: []
    });
    setSelectedImage(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Sell an Item</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Photos
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-eco-500 transition-colors">
              {selectedImage ? (
                <div className="space-y-4">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg mx-auto"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="text-green-600 hover:text-green-700 font-medium text-sm"
                  >
                    Change Photo
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-sm text-gray-600">
                      Drag and drop or click to upload
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                  >
                    <Upload className="w-4 h-4 inline mr-2" />
                    Upload Photo
                  </button>
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Item Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Calculus Textbook 2nd Edition"
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-eco-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your item's condition, features, and any important details..."
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-eco-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price (Rs) *
              </label>
              <input
                type="number"
                id="price"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-eco-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                required
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-eco-500 focus:border-transparent"
              >
                <option value="books">Books</option>
                <option value="uniform">Uniforms</option>
                <option value="calculator">Calculators</option>
                <option value="geometry">Geometry Sets</option>
                <option value="bag">Bags</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Condition and Exchange Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition *
              </label>
              <div className="space-y-2">
                {[
                  { value: 'excellent', label: 'Excellent', description: 'Like new' },
                  { value: 'good', label: 'Good', description: 'Minor wear' },
                  { value: 'fair', label: 'Fair', description: 'Visible use' }
                ].map((condition) => (
                  <label key={condition.value} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="condition"
                      value={condition.value}
                      checked={formData.condition === condition.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value as any }))}
                      className="text-green-600 focus:ring-eco-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">{condition.label}</span>
                      <p className="text-xs text-gray-500">{condition.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exchange Type *
              </label>
              <div className="space-y-2">
                {[
                  { value: 'sale', label: 'For Sale', description: 'Sell for money' },
                  { value: 'exchange', label: 'For Exchange', description: 'Trade for other items' },
                  { value: 'donation', label: 'Free Donation', description: 'Give away for free' }
                ].map((type) => (
                  <label key={type.value} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="exchangeType"
                      value={type.value}
                      checked={formData.exchangeType === type.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, exchangeType: e.target.value as any }))}
                      className="text-green-600 focus:ring-eco-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">{type.label}</span>
                      <p className="text-xs text-gray-500">{type.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-500 text-white py-3 px-6 rounded-2xl font-semibold hover:bg-green-600 transition-colors shadow-lg"
            >
              List Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}