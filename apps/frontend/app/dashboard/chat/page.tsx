"use client";

import { ChatLayout } from "@/components/chat";
import { currentUser, mockConversations } from "@/data/dashboard/messages";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/types/constants";
import { useEffect, useState } from "react";

export default function ChatPage() {

  const [conversations, setConversations] = useState([]);
  
  useEffect(() => {
    const getConversations = async () => {
      try {
        const response = await authFetch(`${BACKEND_URL}/chat/conversations`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch conversations');
        }
        const data = await response.json();
        setConversations(data);
        console.log('Fetched conversations:', data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };  

    getConversations();
  
    return () => {
      
    }
  }, [])
  
  return (
    <div className="h-[calc(100vh-64px)] bg-white">
      <ChatLayout
        conversations={conversations}
        currentUser={currentUser}
      />
    </div>
  );
}