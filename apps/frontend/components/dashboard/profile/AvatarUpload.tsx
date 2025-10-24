"use client";

import { useState, useRef } from "react";
import { X, Upload, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AvatarUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  currentAvatar: string;
}

export default function AvatarUpload({ 
  isOpen, 
  onClose, 
  onUpload, 
  currentAvatar 
}: AvatarUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (uploadedFile) {
      onUpload(uploadedFile);
      onClose();
      setSelectedImage(null);
      setUploadedFile(null);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedImage(null);
    setUploadedFile(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl w-full max-w-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Update Profile Picture</h3>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col items-center space-y-6">
            {/* Current Avatar */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">Current Avatar</p>
              <img
                src={currentAvatar}
                alt="Current avatar"
                className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-gray-200"
              />
            </div>

            {/* New Avatar Preview */}
            {selectedImage ? (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">New Avatar Preview</p>
                <img
                  src={selectedImage}
                  alt="New avatar preview"
                  className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-eco-500"
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-eco-500 transition-colors">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Upload a new profile picture</p>
                <p className="text-sm text-gray-500 mb-4">
                  PNG, JPG, GIF up to 5MB
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-eco-500 text-white px-6 py-2 rounded-xl hover:bg-eco-600 transition-colors font-medium"
                >
                  <Upload className="w-4 h-4 inline mr-2" />
                  Choose File
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Actions */}
            <div className="flex space-x-3 w-full">
              <button
                onClick={handleClose}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedImage}
                className="flex-1 bg-eco-500 text-white py-3 rounded-xl font-semibold hover:bg-eco-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Update Avatar
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}