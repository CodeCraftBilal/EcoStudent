// lib/types/socket-events.ts
export const SOCKET_EVENTS = {
  ORDER: {
    // Client events
    JOIN_CONVERSATION: 'order:join_conversation',
    LEAVE_CONVERSATION: 'order:leave_conversation',
    
    // Server events
    CREATED: 'order:created',
    UPDATED: 'order:updated',
    STATUS_CHANGED: 'order:status_changed',
    CANCELLED: 'order:cancelled',
  },
  
  MESSAGE: {
    SEND: 'message:send',
    RECEIVE: 'message:receive',
    TYPING: 'message:typing',
    READ: 'message:read',
  },

  NOTIFICATION: {
    NOTIFICATION_NEW: 'notification:new',
  }
} as const;

export type SocketEvent = typeof SOCKET_EVENTS;
export type OrderEvent = typeof SOCKET_EVENTS.ORDER;
export type MessageEvent = typeof SOCKET_EVENTS.MESSAGE;
export type NotificationEvent = typeof SOCKET_EVENTS.NOTIFICATION;