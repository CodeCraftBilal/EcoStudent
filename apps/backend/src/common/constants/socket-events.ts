// src/common/constants/socket-events.ts
export const SOCKET_EVENTS = {
  JOIN: 'chat:join',
  LEAVE: 'chat:leave',

  USER: {
    USER_ONLINE: 'user:online',
    USER_OFFLINE: 'user:offline'
  },

  MESSAGE: {
    MESSAGE_SEND: 'message:send',
    MESSAGE_RECEIVE: 'message:receive',
    MESSAGE_NEW: 'message:new',
    MESSAGE_READ: 'message:read'
  },

  NOTIFICATION: {
    NEW: 'notification:new',
    MESSAGE_UNREAD: 'notification:unread'
  },

  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',

  ORDER: {
    // Client events
    JOIN_CONVERSATION: 'order:join_conversation',
    LEAVE_CONVERSATION: 'order:leave_conversation',
    
    // Server events
    CREATED: 'order:created',
    UPDATED: 'order:updated',
    STATUS_CHANGED: 'order:status_changed',
    CANCELLED: 'order:cancelled',
    ACCEPTED: 'order:accepted',
    COMPLETED: 'order:completed',
  },
};
