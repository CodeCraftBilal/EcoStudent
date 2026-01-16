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

  // mock notifications
  export const notificationsData = [
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
      type: "sale" as const,
      title: "Item Sold",
      message: "Your Scientific Calculator has been sold",
      time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      read: false,
      link: "/dashboard/listings",
    },
    {
      id: "3",
      type: "review" as const,
      title: "New Review",
      message: "Sara gave you 5 stars for the uniform",
      time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      read: true,
      link: "/dashboard/reviews",
    },
  ];
  