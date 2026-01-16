"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Upload, Camera } from "lucide-react";
import { UploadItemData } from "@/lib/types/dashboard/types";
import imageCompression from "browser-image-compression";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/types/constants";
import { SuccessDialog } from "../ui/dialogBoxes/Pre-configuredDialog";

interface UploadItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  setIsUploadModalOpen: (uploadItem: boolean) => void;
  // onUpload: (data: UploadItemData) => Promise<void>;
}

interface FormData {
  title: string;
  description: string;
  price: string;
  originalPrice: string;
  category: string;
  subCategory: string;
  condition: string;
  exchangeType: string;
  images: File[];
}

export default function UploadItemModal({
  isOpen,
  onClose,
  setIsUploadModalOpen,
}: UploadItemModalProps) {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleUploadItem = async (data: UploadItemData): Promise<void> => {
    setIsLoading(true);
    setUploadError(null);

    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Append basic fields
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("price", data.price.toString());
      formData.append("originalPrice", data.originalPrice?.toString() || "0");
      formData.append("productType", data.category);
      formData.append("subCategory", data.subCategory || "");
      formData.append("productCondition", data.condition);
      formData.append("exchangeType", data.exchangeType);

      // Append images
      data.images.forEach((image, index) => {
        formData.append("images", image);
      });

      // API call to upload item
      const response = await authFetch(`${BACKEND_URL}/product`, {
        method: "POST",
        body: formData,
        // headers are automatically set by browser for FormData
      });

      if (!response.ok) {
        console.log(response.status, response.statusText);
        const errorData = await response.json();
        throw new Error(
          `${JSON.stringify(errorData.message)}` ||
            `Upload failed with status: ${response.status}`
        );
      }

      const result = await response.json();

      console.log("Item uploaded successfully:", result);

      // Show success message
      setIsDialogOpen(true);

      // Close modal
      // setIsUploadModalOpen(false);

      // You might want to refresh the listings here
      // refreshListings();
    } catch (error: any) {
      console.error("Error uploading item:", error);
      setUploadError(
        error.message || "Failed to upload item. Please try again."
      );

      // Re-throw the error so the modal can handle it too
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    trigger,
    setError,
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      description: "",
      price: "0",
      originalPrice: "0",
      category: "books",
      subCategory: "",
      condition: "good",
      exchangeType: "sale",
      images: [],
    },
  });

  const watchedImages = watch("images");
  const watchCategory = watch("category");

  // Image compression options
  const compressionOptions = {
    maxSizeMB: 1, // Compress to max 1MB
    maxWidthOrHeight: 1024, // Resize to max 1024px width/height
    useWebWorker: true,
    fileType: "image/jpeg" as const,
  };

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith("image/")) {
      return "Please upload only image files";
    }

    // Check file size (4MB)
    if (file.size > 4 * 1024 * 1024) {
      return "File size must be less than 4MB";
    }

    return null;
  };

  const compressImage = async (file: File): Promise<File> => {
    try {
      const compressedFile = await imageCompression(file, compressionOptions);
      return new File([compressedFile], file.name, {
        type: "image/jpeg",
        lastModified: Date.now(),
      });
    } catch (error) {
      console.error("Error compressing image:", error);
      throw new Error("Failed to compress image");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setServerError(null);

    // Check total files count
    const currentFiles = watchedImages || [];
    if (currentFiles.length + files.length > 3) {
      setServerError("You can only upload up to 3 images");
      return;
    }

    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file
        const validationError = validateFile(file);
        if (validationError) {
          setServerError(validationError);
          continue;
        }

        // Compress image
        const compressedFile = await compressImage(file);
        newFiles.push(compressedFile);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          newPreviews.push(result);
          setSelectedImages((prev) => [...prev, result]);
        };
        reader.readAsDataURL(compressedFile);
      }

      if (newFiles.length > 0) {
        const updatedFiles = [...currentFiles, ...newFiles];
        setValue("images", updatedFiles);
        await trigger("images");
      }
    } catch (error) {
      console.error("Error processing images:", error);
      setServerError("Failed to process images. Please try again.");
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const updatedFiles = watchedImages.filter((_, i) => i !== index);
    const updatedPreviews = selectedImages.filter((_, i) => i !== index);

    setValue("images", updatedFiles);
    setSelectedImages(updatedPreviews);
  };

  const onSubmit = async (data: FormData) => {
    if (!data.images || data.images.length === 0) {
      setServerError("Please upload at least one image");
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    if (data.category === "other") {
      console.log("category: ", data.category);
      if (data.subCategory.length < 3) {
        setError("subCategory", { message: "Min leght is 3" });
      }

      if (data.subCategory.length > 30) {
        setError("subCategory", { message: "Max length is 30" });
      }
    }

    console.log(typeof data.price, typeof data.originalPrice);
    if (parseFloat(data.price) > parseFloat(data.originalPrice)) {
      setError("price", {
        message: "sale price should be less than orignal price",
      });
    }

    try {
      console.log("data: ", data);
      await handleUploadItem(data as UploadItemData);
      // onClose();
      reset();
      setSelectedImages([]);
    } catch (error: any) {
      console.error("Upload error:", error);
      setServerError(
        error.message || "Failed to upload item. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedImages([]);
    setServerError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Sell an Item</h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{serverError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Photos * (Max 3 images, 4MB each)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-eco-500 transition-colors">
              {selectedImages.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    {selectedImages.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {selectedImages.length < 3 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                      Add More Photos ({selectedImages.length}/3)
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-sm text-gray-600">
                      Drag and drop or click to upload
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF up to 4MB each
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                  >
                    <Upload className="w-4 h-4 inline mr-2" />
                    Upload Photo
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={isSubmitting}
              />
              {errors.images && (
                <p className="text-red-500 text-xs mt-2">
                  {errors.images.message}
                </p>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Item Title *
            </label>
            <input
              type="text"
              id="title"
              disabled={isSubmitting}
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters",
                },
                maxLength: {
                  value: 100,
                  message: "Title must be less than 100 characters",
                },
              })}
              placeholder="e.g., Calculus Textbook 2nd Edition"
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-eco-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-2">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              disabled={isSubmitting}
              {...register("description", {
                required: false,
                minLength: {
                  value: 10,
                  message: "Description must be at least 10 characters",
                },
                maxLength: {
                  value: 1000,
                  message: "Description must be less than 1000 characters",
                },
              })}
              placeholder="Describe your item's condition, features, and any important details..."
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-eco-500 focus:border-transparent resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-2">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Price (Rs) *
              </label>
              <input
                type="number"
                id="price"
                min="0"
                step="1"
                disabled={isSubmitting}
                {...register("price", {
                  required: "Price is required",
                  min: {
                    value: 0,
                    message: "Price must be positive",
                  },
                  max: {
                    value: 1000000,
                    message: "Price must be reasonable",
                  },
                })}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-eco-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-2">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Orignal Price (Rs)
              </label>
              <input
                type="number"
                id="price"
                min="0"
                step="1"
                disabled={isSubmitting}
                {...register("originalPrice", {
                  required: false,
                  min: {
                    value: 0,
                    message: "Price must be positive",
                  },
                  max: {
                    value: 1000000,
                    message: "Price must be reasonable",
                  },
                })}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-eco-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              {errors.originalPrice && (
                <p className="text-red-500 text-xs mt-2">
                  {errors.originalPrice?.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category *
              </label>
              <select
                id="category"
                disabled={isSubmitting}
                {...register("category", {
                  required: "Category is required",
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-eco-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                <option value="books">Books</option>
                <option value="uniform">Uniforms</option>
                <option value="calculator">Calculators</option>
                <option value="geometry">Geometry Sets</option>
                <option value="bag">Bags</option>
                <option value="other">Other</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-xs mt-2">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* sub category */}
            {watchCategory === "other" && (
              <div>
                <label
                  htmlFor="subcategory"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Sub Category *
                </label>
                <input
                  type="text"
                  id="subcategory"
                  disabled={isSubmitting}
                  {...register("subCategory", {
                    required: "Sub Category is required",
                    min: {
                      value: 3,
                      message: "min length is 3",
                    },
                    max: {
                      value: 30,
                      message: "max value is 30",
                    },
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-eco-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                ></input>
                {errors.subCategory && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.subCategory?.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Condition and Exchange Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition *
              </label>
              <div className="space-y-2">
                {[
                  {
                    value: "excellent",
                    label: "Excellent",
                    description: "Like new",
                  },
                  { value: "good", label: "Good", description: "Minor wear" },
                  { value: "fair", label: "Fair", description: "Visible use" },
                ].map((condition) => (
                  <label
                    key={condition.value}
                    className="flex items-center space-x-3"
                  >
                    <input
                      type="radio"
                      value={condition.value}
                      disabled={isSubmitting}
                      {...register("condition", {
                        required: "Condition is required",
                      })}
                      className="text-green-600 focus:ring-eco-500 disabled:cursor-not-allowed"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        {condition.label}
                      </span>
                      <p className="text-xs text-gray-500">
                        {condition.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
              {errors.condition && (
                <p className="text-red-500 text-xs mt-2">
                  {errors.condition.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exchange Type *
              </label>
              <div className="space-y-2">
                {[
                  {
                    value: "sale",
                    label: "For Sale",
                    description: "Sell for money",
                  },
                  {
                    value: "exchange",
                    label: "For Exchange",
                    description: "Trade for other items",
                  },
                  {
                    value: "donation",
                    label: "Free Donation",
                    description: "Give away for free",
                  },
                ].map((type) => (
                  <label
                    key={type.value}
                    className="flex items-center space-x-3"
                  >
                    <input
                      type="radio"
                      value={type.value}
                      disabled={isSubmitting}
                      {...register("exchangeType", {
                        required: "Exchange type is required",
                      })}
                      className="text-green-600 focus:ring-eco-500 disabled:cursor-not-allowed"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        {type.label}
                      </span>
                      <p className="text-xs text-gray-500">
                        {type.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
              {errors.exchangeType && (
                <p className="text-red-500 text-xs mt-2">
                  {errors.exchangeType.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-2xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-green-500 text-white py-3 px-6 rounded-2xl font-semibold hover:bg-green-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                "List Item"
              )}
            </button>
          </div>
        </form>

        <SuccessDialog 
          title="Item Uploaded"
          description="Item Uploaded Successfuly"
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setIsUploadModalOpen(false);
          }}
          buttons={[
            {
              text: 'OK',
              onClick() {
                setIsDialogOpen(false);
                setIsUploadModalOpen(false);
              }
            }
          ]}
         />
      </div>
    </div>
  );
}
