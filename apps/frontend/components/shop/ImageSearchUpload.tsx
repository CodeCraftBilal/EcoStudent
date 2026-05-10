'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, UploadCloud, Loader2 } from 'lucide-react';
import config from '@/config';

interface ImageSearchUploadProps {
  onResultsFound: (results: any[], file: File) => void;
}

export default function ImageSearchUpload({ onResultsFound }: ImageSearchUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }
    
    // Preview image
    setPreview(URL.createObjectURL(file));
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      // Call NestJS endpoint
      const response = await fetch(`${config.backendUrl}/product/image-search?page=1&limit=12`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();

      // Pass matching products to parent
      if (data?.matches) {
        onResultsFound(data.matches, file);
      } else if (Array.isArray(data)) {
        onResultsFound(data, file);
      }
      setIsOpen(false);
      setPreview(null);
    } catch (err) {
      setError('Failed to search using the image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="relative flex items-center" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:text-green-600 transition-colors rounded-full hover:bg-gray-100 flex items-center justify-center"
        title="Search by image"
      >
        <Camera size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 mt-2 w-80 bg-white shadow-xl rounded-xl border border-gray-200 z-50 p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800">Image Search</h3>
            <button onClick={() => { setIsOpen(false); setPreview(null); setError(null); }} className="text-gray-400 hover:text-red-500">
              <X size={18} />
            </button>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
              isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:bg-gray-50'
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <div className="relative h-32 w-full">
                <img src={preview} alt="Preview" className="h-full w-full object-contain rounded-md" />
                {isLoading && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-md">
                    <Loader2 className="animate-spin text-green-600" size={32} />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <UploadCloud size={32} className="text-gray-400" />
                <p className="text-sm text-gray-600">Drag & drop an image or click to upload</p>
                <p className="text-xs text-gray-400">JPG, PNG, WEBP (Max 5MB)</p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
              onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            />
          </div>
          
          {error && <p className="mt-2 text-xs text-red-500 text-center">{error}</p>}
        </div>
      )}
    </div>
  );
}
