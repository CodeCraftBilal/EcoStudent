"use client";

import { useState } from "react";
import { Check, CheckCheck, Edit, Trash2, Reply } from "lucide-react";
import { Message } from "@/lib/types/messages/types";

interface MessageItemProps {
  message: Message;
  isOwnMessage: boolean;
  onEdit: (messageId: string, newContent: string) => void;
  onDelete: (messageId: string) => void;
  onReply: (messageId: string) => void;
}

export default function MessageItem({
  message,
  isOwnMessage,
  onEdit,
  onDelete,
  onReply
}: MessageItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Check className="w-4 h-4 text-gray-300" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-gray-300" />;
      case 'read':
        return <CheckCheck className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const handleEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      onEdit(message.id, editContent);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  return (
    <div
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative max-w-xs lg:max-w-md ${
        isOwnMessage 
          ? 'bg-green-500 text-white rounded-2xl rounded-br-md' 
          : 'bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md'
      } p-3`}>
        
        {/* Message Content */}
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-white text-gray-900 rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-eco-500"
              rows={3}
              autoFocus
            />
            <div className="flex space-x-2 justify-end">
              <button
                onClick={handleCancelEdit}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            
            {/* Message Meta */}
            <div className={`flex items-center justify-end space-x-1 mt-1 ${
              isOwnMessage ? 'text-green-100' : 'text-gray-500'
            }`}>
              {message.isEdited && (
                <span className="text-xs mr-1">(edited)</span>
              )}
              <span className="text-xs">{formatTime(message.timestamp)}</span>
              {isOwnMessage && getStatusIcon(message.status)}
            </div>

            {/* Message Actions */}
            {isHovered && !isEditing && (
              <div className={`absolute -top-8 ${isOwnMessage ? 'right-2' : 'left-2'} flex space-x-1 bg-white border border-gray-200 rounded-lg p-1 shadow-lg`}>
                <button
                  onClick={() => onReply(message.id)}
                  className="p-1 text-gray-600 hover:text-green-600 rounded hover:bg-gray-50"
                >
                  <Reply className="w-3 h-3" />
                </button>
                {isOwnMessage && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1 text-gray-600 hover:text-green-600 rounded hover:bg-gray-50"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDelete(message.id)}
                      className="p-1 text-gray-600 hover:text-red-600 rounded hover:bg-gray-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}