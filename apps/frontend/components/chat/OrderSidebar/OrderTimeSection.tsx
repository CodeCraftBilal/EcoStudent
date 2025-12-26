// components/chat/OrderSidebar/OrderTimeSection.tsx
import { Calendar, Clock, Edit2, Check, X } from "lucide-react";
import { useState } from "react";

interface OrderTimeSectionProps {
  meetupTime: string;
  isOwner: boolean;
  isEditing: boolean;
  onUpdate: (updates: any) => Promise<void>;
}

export default function OrderTimeSection({ 
  meetupTime, 
  isOwner, 
  isEditing,
  onUpdate 
}: OrderTimeSectionProps) {
  const [editedTime, setEditedTime] = useState(meetupTime.slice(0, 16)); // Format for datetime-local
  const [isSaving, setIsSaving] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onUpdate({ meetupTime: editedTime });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedTime(meetupTime.slice(0, 16));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-eco-200">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-700 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Meetup Time
        </h4>
        
        {isOwner && !isEditing && (
          <button
            onClick={() => {
              // This will trigger edit mode in parent
              // We need to pass this up to parent
            }}
            className="text-sm text-eco-600 hover:text-eco-700 flex items-center gap-1"
          >
            <Edit2 className="w-3 h-3" />
            Edit
          </button>
        )}
      </div>

      {isEditing && isOwner ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select New Meetup Time
            </label>
            <input
              type="datetime-local"
              value={editedTime}
              onChange={(e) => setEditedTime(e.target.value)}
              className="w-full px-4 py-3 border border-eco-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-eco-500 bg-white"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 border border-eco-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !editedTime}
              className="flex-1 px-4 py-2 bg-eco-500 text-white rounded-lg hover:bg-eco-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Time"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 bg-white border border-eco-200 rounded-lg">
          <Clock className="w-5 h-5 text-eco-500" />
          <div>
            <p className="font-medium text-gray-900">{formatDate(meetupTime)}</p>
            <p className="text-sm text-gray-500">
              {new Date(meetupTime) > new Date() ? 'Upcoming' : 'Past'}
              {new Date(meetupTime) > new Date() && (
                <span className="ml-2">
                  {Math.ceil((new Date(meetupTime).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}