'use client'
import { useSocket } from '@/context/useSocket'
import React, { useEffect, useState } from 'react'

const page = () => {
    const socket = useSocket();
    const [message, setMessage] = useState('')
    const handleClick = () => {
        if(!socket) return;
        console.log("Button clicked");
        socket.emit("message:send", {content: "Hello from client"})
    }

    useEffect(() => {
      socket?.on("message:send", (data:any) => {
        console.log("Message received from server:", data);
        setMessage(data.status.content)
      })
      return () => {
        socket?.off("message:send");
      }
    }, [socket, message])
    
  return (
    <div>
        <div>{message}</div>
    <button onClick={handleClick}>Click Me</button>  
    </div>
  )
}

export default page
