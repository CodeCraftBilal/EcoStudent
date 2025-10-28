export const messagesNotificationData = [
    {
      id: "1",
      type: "message" as const,
      title: "New Message",
      message: "Ali sent you a message about the Calculus book",
      time: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      read: false,
      link: "/chat",
    },
    {
      id: "2",
      type: "message" as const,
      title: "New Message",
      message: "Ali sent you a message about the Calculus book",
      time: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      read: false,
      link: "/chat",
    },
    {
      id: "3",
      type: "message" as const,
      title: "New Message",
      message: "Ali sent you a message about the Calculus book",
      time: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      read: false,
      link: "/chat",
    },
  ]