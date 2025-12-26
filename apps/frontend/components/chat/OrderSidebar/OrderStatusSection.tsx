// components/chat/OrderSidebar/OrderStatusSection.tsx
import { Edit2, X, Check } from "lucide-react";

interface OrderStatusSectionProps {
  status: string;
  isOwner: boolean;
  isEditing: boolean;
  onEditToggle: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function OrderStatusSection({
  status,
  isOwner,
  isEditing,
  onEditToggle,
  onSave,
  onCancel
}: OrderStatusSectionProps) {
  if (!isOwner) return null;

  return (
    <div className="flex items-center justify-between mb-6">
      <h4 className="font-medium text-gray-700">Order Status</h4>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <button
              onClick={onCancel}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-3 py-1 text-sm bg-eco-500 text-white rounded-lg hover:bg-eco-600 transition-colors flex items-center gap-1"
            >
              <Check className="w-4 h-4" />
              Save
            </button>
          </>
        ) : (
          <button
            onClick={onEditToggle}
            className="px-3 py-1 text-sm border border-eco-200 text-eco-600 rounded-lg hover:bg-eco-50 transition-colors flex items-center gap-1"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        )}
      </div>
    </div>
  );
}