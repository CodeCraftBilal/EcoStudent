"use client";

import { MessageCircle, X, Minus, SendHorizonal, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Lottie from "lottie-react";
import voiceRecorderAnim from "@/public/lotieAnim/voiceRecorder.json";

interface ChatProps {
  showChat: boolean;
  setShowChat: (show: boolean) => void;
  draggable?: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function Chat({ showChat, setShowChat, draggable = true }: ChatProps) {
  const [messageVal, setMessageVal] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);

  // Chat modal drag state
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [isModalDragging, setIsModalDragging] = useState(false);
  const chatModalRef = useRef<HTMLDivElement>(null);

  // Voice recorder animation state
  const [showRcorderAnim, setShowRcorderAnim] = useState(false);
  // show/hide chat button state
  const [showChatBtn, setShowChatBtn] = useState(true);

  // Floating button drag state
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [isButtonDragging, setIsButtonDragging] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize positions
  useEffect(() => {
    // Set initial button position (bottom right)
    setButtonPosition({
      x: window.innerWidth - 100,
      y: window.innerHeight - 100,
    });

    // Set initial modal position (bottom right with offset)
    setModalPosition({
      x: window.innerWidth - 350,
      y: window.innerHeight - 450,
    });
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle chat modal drag functionality
  const handleModalDragStart = (event: React.MouseEvent) => {
    if (!draggable) return;

    setIsModalDragging(true);
    const modal = chatModalRef.current;
    if (!modal) return;

    const startX = event.clientX - modalPosition.x;
    const startY = event.clientY - modalPosition.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newX = moveEvent.clientX - startX;
      const newY = moveEvent.clientY - startY;

      // Constrain to viewport boundaries
      const maxX = window.innerWidth - modal.offsetWidth;
      const maxY = window.innerHeight - modal.offsetHeight;

      setModalPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleMouseUp = () => {
      setIsModalDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Handle floating button drag functionality
  const handleButtonDragStart = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsButtonDragging(true);
    const button = buttonRef.current;
    if (!button) return;

    const startX = event.clientX - buttonPosition.x;
    const startY = event.clientY - buttonPosition.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newX = moveEvent.clientX - startX;
      const newY = moveEvent.clientY - startY;

      // Constrain to viewport boundaries
      const maxX = window.innerWidth - button.offsetWidth;
      const maxY = window.innerHeight - button.offsetHeight;

      setButtonPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleMouseUp = () => {
      setIsButtonDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleSendMessage = () => {
    if (!messageVal.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageVal,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessageVal("");

    // Simulate bot response after a delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! I'll get back to you soon.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Public method to add messages from parent component
  const addMessage = (text: string, sender: "user" | "bot" = "user") => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  // Expose addMessage method to parent component
  useEffect(() => {
    // @ts-ignore
    window.chatAddMessage = addMessage;
  }, []);

  return (
    <div className="bg-transparent">
      {/* Floating Chat Button - Always Draggable */}
      <motion.button
        ref={buttonRef}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          x: buttonPosition.x,
          y: buttonPosition.y,
        }}
        whileHover={{ scale: isButtonDragging ? 1 : 1.1 }}
        whileTap={{ scale: 0.95 }}
        onMouseDown={handleButtonDragStart}
        onClick={(e) => {
          // Only open chat if not dragging
          if (!isButtonDragging) {
            setShowChat(true);
            setShowChatBtn(false);
          }
        }}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          cursor: isButtonDragging ? "grabbing" : "grab",
        }}
        className={`${showChatBtn ? "" : "hidden"} bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50`}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative inset-0 bg-transparent bg-opacity-50 z-50"
            style={{
              pointerEvents: "none", // Allow clicks through the overlay
            }}
          >
            <motion.div
              ref={chatModalRef}
              initial={{ scale: 0.8, opacity: 0, y: 100 }}
              animate={{
                scale: 1,
                opacity: 1,
                // y: 0,
                x: modalPosition.x,
                y: modalPosition.y,
              }}
              exit={{ scale: 0.8, opacity: 0, y: 100 }}
              style={{
                position: "fixed",
                left: 0,
                top: 0,
                cursor: isModalDragging
                  ? "grabbing"
                  : draggable
                    ? "grab"
                    : "default",
                pointerEvents: "auto",
              }}
              className="bg-white rounded-2xl shadow-xl w-80 h-96 select-none"
            >
              {/* Chat Header - Drag handle */}
              <div
                onMouseDown={draggable ? handleModalDragStart : undefined}
                className={`bg-green-500 text-white p-4 rounded-t-2xl flex justify-between items-center ${
                  draggable ? "cursor-grab active:cursor-grabbing" : ""
                }`}
              >
                <div>
                  <h3 className="font-semibold">EcoStudent Support</h3>
                  <p className="text-green-100 text-sm">
                    Online • Usually replies instantly
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowChatBtn(true);
                      setShowChat(false);
                    }}
                    className="text-green-100 hover:text-white transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowChat(false)}
                    className="text-green-100 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-4 h-64 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`rounded-2xl p-3 max-w-xs ${
                          message.sender === "user"
                            ? "bg-green-500 text-white rounded-br-none"
                            : "bg-gray-100 text-gray-800 rounded-tl-none"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === "user"
                              ? "text-green-100"
                              : "text-gray-500"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-2 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={messageVal}
                    onChange={(e) => setMessageVal(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    // disabled={!messageVal.trim()}
                    className={`${showRcorderAnim ? 'bg-white' : 'bg-green-500'} min-w-8 text-white p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {messageVal.length > 0 ? (
                      <SendHorizonal className="w-6 h-6" />
                    ) : (
                      <div
                        className="w-6 h-6"
                        onMouseDown={() => {
                          setShowRcorderAnim(true);
                        }}
                        onMouseUp={() => {
                          setShowRcorderAnim(false);
                          handleSendMessage;
                        }}
                      >
                        <Mic className={`w-6 h-6 ${showRcorderAnim ? 'hidden' : ''}`} />
                        <Lottie
                        className={`${showRcorderAnim ? '' : 'hidden'} w-10 h-10 red`} 
                        animationData={voiceRecorderAnim}
                        loop={true}
                        autoPlay={true}
                        />
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
