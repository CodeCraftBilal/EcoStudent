// components/chat/OrderSidebar/index.tsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Order } from "@/lib/types/dashboard/order/type";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/types/constants";
import { useSocket } from "@/context/useSocket";
import { SOCKET_EVENTS } from "@/lib/socket-events";
import LoadingSpinner from "../../Loading/LoadingSpinner";
import OrderHeader from "./OrderHeader";
import OrderStatusSection from "./OrderStatusSection";
import OrderProductInfo from "./OrderProductInfo";
import OrderPriceSection from "./OrderPriceSection";
import OrderLocationSection from "./OrderLocationSection";
import OrderTimeSection from "./OrderTimeSection";
import OrderParticipants from "./OrderParticipants";
import OrderTimeline from "./OrderTimeline";
import OrderGuidelines from "./OrderGuidelines";
import CreateOrderSection from "./CreateOrderSection";
import OrderErrorState from "./OrderErrorState";
import OrderActions from "./OrderActions";
import { Conversation } from "@/lib/types/messages/types";

interface OrderSidebarProps {
  conversationId?: string;
  productId?: number;
  selectedConversation: Conversation;
  currentUser: {
    id: number;
    role?: string;
  };
  isOwner: boolean;
}

export default function OrderSidebar({ 
  conversationId, 
  productId, 
  currentUser, 
  isOwner,
  selectedConversation
}: OrderSidebarProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const { orderSocket, connectOrderSocket, disconnectOrderSocket, isConnected } = useSocket();

  // Establish order socket connection
  useEffect(() => {
    
    connectOrderSocket();
    return () => {
      disconnectOrderSocket();
    }
  }, [])
  

  // Join/Leave conversation room for real-time updates
  useEffect(() => {
    if (!orderSocket || !conversationId) return;
    // Join conversation room
    orderSocket.emit(SOCKET_EVENTS.ORDER.JOIN_CONVERSATION, { 
      conversationId: parseInt(conversationId) 
    });

    return () => {
      // Leave conversation room on cleanup
      orderSocket.emit(SOCKET_EVENTS.ORDER.LEAVE_CONVERSATION, { 
        conversationId: parseInt(conversationId) 
      });
    };
  }, [orderSocket, conversationId]);

  // Setup socket event listeners
  useEffect(() => {
    if (!orderSocket) return;

    const handleOrderCreated = (data: any) => {
      console.log('Order created via socket:', data);
      if (data.conversationId === parseInt(conversationId || '0')) {
        setOrder(data.data);
        setLoading(false);
      }
    };

    const handleOrderUpdated = (data: any) => {
      console.log('Order updated via socket:', data);
      if (data.conversationId === parseInt(conversationId || '0')) {
        setOrder(data.data);
      }
    };

    const handleOrderStatusChanged = (data: any) => {
      console.log('Order status changed via socket:', data);
      if (data.conversationId === parseInt(conversationId || '0')) {
        setOrder(data.data);
        setIsUpdatingStatus(false);
        
        // Show notification based on status
        if (data.status === 'accepted') {
          showNotification('Order Accepted', 'The buyer has accepted the order');
        } else if (data.status === 'cancelled') {
          showNotification('Order Cancelled', 'The order has been cancelled');
        } else if (data.status === 'completed') {
          showNotification('Order Completed', 'The exchange has been completed');
        }
      }
    };

    const handleOrderCancelled = (data: any) => {
      console.log('Order cancelled via socket:', data);
      if (data.conversationId === parseInt(conversationId || '0')) {
        setOrder(data.data);
        setIsUpdatingStatus(false);
      }
    };

    orderSocket.on(SOCKET_EVENTS.ORDER.CREATED, handleOrderCreated);
    orderSocket.on(SOCKET_EVENTS.ORDER.UPDATED, handleOrderUpdated);
    orderSocket.on(SOCKET_EVENTS.ORDER.STATUS_CHANGED, handleOrderStatusChanged);
    orderSocket.on(SOCKET_EVENTS.ORDER.CANCELLED, handleOrderCancelled);

    return () => {
      orderSocket.off(SOCKET_EVENTS.ORDER.CREATED, handleOrderCreated);
      orderSocket.off(SOCKET_EVENTS.ORDER.UPDATED, handleOrderUpdated);
      orderSocket.off(SOCKET_EVENTS.ORDER.STATUS_CHANGED, handleOrderStatusChanged);
      orderSocket.off(SOCKET_EVENTS.ORDER.CANCELLED, handleOrderCancelled);
    };
  }, [orderSocket, conversationId]);

  const showNotification = (title: string, message: string) => {
    // You can use a toast library or custom notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body: message });
    }
  };

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!conversationId && !productId) return;

      try {
        setLoading(true);
        setError(null);

        // Try to fetch existing order for this conversation/product
        const response = await authFetch(
          `${BACKEND_URL}/order/conversation/${conversationId || productId}`
        );

        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        } else if (response.status === 404) {
          // No order exists yet
          setOrder(null);
        } else {
          throw new Error("Failed to fetch order details");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [conversationId, productId]);

  // Calculate if cancellation is allowed (within 10% of total time)
  const canCancelOrder = useMemo(() => {
    if (!order || !order.createdAt || !order.meetupTime) return false;
    
    const createdAt = new Date(order.createdAt).getTime();
    const meetupTime = new Date(order.meetupTime).getTime();
    const now = Date.now();
    
    // Total time between creation and meetup
    const totalTime = meetupTime - createdAt;
    
    // Cancellation allowed within first 10% of total time
    const cancellationDeadline = createdAt + (totalTime * 0.1);
    
    return now < cancellationDeadline;
  }, [order]);

  // Create new order
  const handleCreateOrder = async (orderData: {
    agreedPrice: number;
    meetupLocation: string;
    meetupLatitude: number;
    meetupLongitude: number;
    meetupTime: string;
  }) => {
    try {
      setLoading(true);
      console.log("Creating order with data:", orderData, 'buyer Id: ', selectedConversation.participant.id);
      const response = await authFetch(`${BACKEND_URL}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          conversationId: conversationId ? parseInt(conversationId) : undefined,
          ...orderData,
          buyerId: Number(selectedConversation.participant.id)
        })
      });

      if (response.ok) {
        const newOrder = await response.json();
        setOrder(newOrder);
        // Socket event will update UI via listener
      } else {
        throw new Error("Failed to create order");
      }
    } catch (err) {
      console.error("Error creating order:", err);
      setError("Failed to create order");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update order
  const handleUpdateOrder = async (updates: Partial<Order>) => {
    if (!order) return;

    try {
      setLoading(true);
      const response = await authFetch(`${BACKEND_URL}/order/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrder(updatedOrder);
        // Socket event will update UI via listener
      } else {
        throw new Error("Failed to update order");
      }
    } catch (err) {
      console.error("Error updating order:", err);
      setError("Failed to update order");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const handleUpdateStatus = async (status: Order['status']) => {
    if (!order) return;

    try {
      setIsUpdatingStatus(true);
      const response = await authFetch(`${BACKEND_URL}/order/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrder(updatedOrder);
        // Socket event will update UI via listener
      } else {
        throw new Error(`Failed to ${status} order`);
      }
    } catch (err) {
      console.error(`Error ${status}ing order:`, err);
      setError(`Failed to ${status} order`);
      setIsUpdatingStatus(false);
      throw err;
    }
  };

  // Accept order (specific handler for buyer)
  const handleAcceptOrder = async () => {
    await handleUpdateStatus('accepted');
  };

  // Cancel order
  const handleCancelOrder = async () => {
    const reason = prompt("Please provide a reason for cancellation (optional):");
    if (reason !== null) {
      await handleUpdateStatus('cancelled');
    }
  };

  // Check if user is buyer
  const isBuyer = useMemo(() => {
    return order?.buyerId === currentUser.id;
  }, [order, currentUser.id]);

  if (loading) {
    return (
      <div className="w-full h-full border-l border-gray-200 bg-linear-to-br from-eco-50 to-eco-blue-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="small" />
          <p className="text-gray-400 text-sm mt-2">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <OrderErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="w-full lg:w-full h-full border-l border-gray-200 bg-linear-to-br from-eco-50 to-eco-blue-50 overflow-y-auto">
      <div className="p-6">
        <OrderHeader order={order} />
        
        {!order ? (
          <>
            <CreateOrderSection 
              onCreateOrder={handleCreateOrder}
              isOwner={isOwner}
              conversation={selectedConversation}
            />
            <OrderGuidelines />
          </>
        ) : (
          <>
            <OrderProductInfo product={order.product} orderId={order.id} />
            
            {/* Order Actions (Accept/Cancel buttons) */}
            <OrderActions
              order={order}
              isOwner={isOwner}
              isBuyer={isBuyer}
              canCancel={canCancelOrder}
              isUpdating={isUpdatingStatus}
              onAccept={handleAcceptOrder}
              onCancel={handleCancelOrder}
            />
            
            <div className="space-y-6">
              <OrderStatusSection 
                status={order.status}
                isOwner={isOwner}
                isEditing={isEditing}
                onEditToggle={() => setIsEditing(!isEditing)}
                onSave={() => setIsEditing(false)}
                onCancel={() => setIsEditing(false)}
              />
              
              <OrderPriceSection 
                agreedPrice={order.agreedPrice}
                originalPrice={order.product?.price}
                isOwner={isOwner}
                isEditing={isEditing}
                onUpdate={handleUpdateOrder}
              />
              
              <OrderLocationSection 
                location={order.meetupLocation}
                latitude={order.meetupLatitude}
                longitude={order.meetupLongitude}
                isOwner={isOwner}
                isEditing={isEditing}
                onUpdate={handleUpdateOrder}
              />
              
              <OrderTimeSection 
                meetupTime={order.meetupTime}
                isOwner={isOwner}
                isEditing={isEditing}
                onUpdate={handleUpdateOrder}
              />
              
              <OrderParticipants 
                buyer={order.buyer}
                seller={order.seller}
                currentUserId={currentUser.id}
              />
              
              <OrderTimeline status={order.status} />
              
              {/* Real-time status indicator */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    isConnected 
                      ? 'bg-green-500 animate-pulse' 
                      : 'bg-gray-400'
                  }`} />
                  <span>
                    {isConnected ? 'Live updates enabled' : 'Connecting...'}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  Last updated: {new Date().toLocaleTimeString()}
                </span>
              </div>
              
              {/* Cancellation Info */}
              {canCancelOrder && order.status === 'accepted' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 flex items-center gap-2">
                    <span className="font-medium">Cancellation Window:</span>
                    You can cancel this order within the first 10% of the time until meetup.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}