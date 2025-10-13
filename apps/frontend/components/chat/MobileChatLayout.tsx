"use client";

import { useState, useEffect } from "react";
import ConversationList from "./ConversationList";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ChatEmptyState from "./ChatEmptyState";
import { Conversation, Message, User } from "@/lib/types/messages/types";
import { ChevronLeft } from "lucide-react";

interface MobileChatLayoutProps {
  conversations: Conversation[];
  currentUser: User;
}

type View = "conversations" | "chat";

export default function MobileChatLayout({ conversations, currentUser }: MobileChatLayoutProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>("conversations");
  const [messages, setMessages] = useState<Message[]>([]);

  const selectedConversation = conversations.find(
    conv => conv.id === selectedConversationId
  );

  // Auto-switch to chat view when conversation is selected
  useEffect(() => {
    if (selectedConversationId) {
      setCurrentView("chat");
    }
  }, [selectedConversationId]);

  const handleBackToConversations = () => {
    setCurrentView("conversations");
    setSelectedConversationId(null);
  };

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  const handleSendMessage = (content: string) => {
    if (!selectedConversation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: selectedConversation.participant.id,
      content,
      timestamp: new Date().toISOString(),
      type: 'text',
      status: 'sent'
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, content: newContent, isEdited: true }
          : msg
      )
    );
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const handleReplyToMessage = (messageId: string) => {
    console.log("Reply to message:", messageId);
  };

  const handleCall = () => {
    console.log("Initiate voice call");
  };

  const handleVideoCall = () => {
    console.log("Initiate video call");
  };

  const handleMenuClick = () => {
    console.log("Open chat menu");
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Conversations View */}
      {currentView === "conversations" && (
        <div className="flex-1 flex flex-col">
          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            onConversationSelect={handleConversationSelect}
            showReturnToWebsite={true}
          />
        </div>
      )}

      {/* Chat View */}
      {currentView === "chat" && selectedConversation && (
        <div className="flex-1 flex flex-col">
          <ChatHeader
            user={selectedConversation.participant}
            onCall={handleCall}
            onVideoCall={handleVideoCall}
            onMenuClick={handleMenuClick}
            onBack={handleBackToConversations}
            showBackButton={true}
            showReturnToWebsite={false}
          />
          
          <MessageList
            messages={messages}
            currentUserId={currentUser.id}
            onEditMessage={handleEditMessage}
            onDeleteMessage={handleDeleteMessage}
            onReplyToMessage={handleReplyToMessage}
          />
          
          <MessageInput
            onSendMessage={handleSendMessage}
            placeholder={`Message ${selectedConversation.participant.name}...`}
          />
        </div>
      )}

      {/* Empty State when no conversation is selected but in chat view (shouldn't happen) */}
      {currentView === "chat" && !selectedConversation && (
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b border-gray-200 p-4 flex items-center">
            <button
              onClick={handleBackToConversations}
              className="p-2 text-gray-600 hover:text-eco-600 hover:bg-eco-50 rounded-full transition-colors mr-3"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-gray-500">Select a conversation</span>
          </div>
          <ChatEmptyState 
            title="No conversation selected"
            description="Please select a conversation to start chatting"
          />
        </div>
      )}
    </div>
  );
}