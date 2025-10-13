"use client";

import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import MobileChatLayout from "./MobileChatLayout";
import ConversationList from "./ConversationList";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ChatEmptyState from "./ChatEmptyState";
import { Conversation, Message, User } from "@/lib/types/messages/types";

interface ChatLayoutProps {
  conversations: Conversation[];
  currentUser: User;
}

export default function ChatLayout({ conversations, currentUser }: ChatLayoutProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const isMobile = useMediaQuery({ maxWidth: 768 });

  const selectedConversation = conversations.find(
    conv => conv.id === selectedConversationId
  );

  // Use MobileChatLayout for mobile devices
  if (isMobile) {
    return (
      <MobileChatLayout
        conversations={conversations}
        currentUser={currentUser}
      />
    );
  }

  // Desktop Layout
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
    <div className="flex h-screen bg-white">
      {/* Conversation List Sidebar */}
      <div className="w-80 lg:w-96 border-r border-gray-200">
        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onConversationSelect={setSelectedConversationId}
          showReturnToWebsite={true}
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <ChatHeader
              user={selectedConversation.participant}
              onCall={handleCall}
              onVideoCall={handleVideoCall}
              onMenuClick={handleMenuClick}
              showBackButton={false}
              showReturnToWebsite={true}
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
          </>
        ) : (
          <ChatEmptyState />
        )}
      </div>
    </div>
  );
}