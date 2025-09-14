'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useSocket, MessageData } from '@/context/SocketContext'
import { Message } from '@/app/(main)/chat/types'
import { convertSocketMessageToUI } from '@/app/(main)/chat/utils/messageConverter'

// Hook for managing chat room state
export const useChatRoom = (roomId: string | null) => {
  const { joinRoom, leaveRoom, isConnected } = useSocket()
  const [isInRoom, setIsInRoom] = useState(false)

  useEffect(() => {
    if (roomId && isConnected && !isInRoom) {
      console.log('Joining room:', roomId)
      joinRoom(roomId)
      setIsInRoom(true)
    }

    return () => {
      if (roomId && isInRoom) {
        console.log('Leaving room:', roomId)
        leaveRoom(roomId)
        setIsInRoom(false)
      }
    }
  }, [roomId, isConnected, joinRoom, leaveRoom, isInRoom])

  return { isInRoom }
}

// Hook for real-time messages
export const useRealtimeMessages = (roomId: string | null, currentUserId: string) => {
  const { onNewMessage, onMessagesSeen } = useSocket()
  const [messages, setMessages] = useState<Message[]>([])
  const [lastMessage, setLastMessage] = useState<Message | null>(null)

  // Listen for new messages
  useEffect(() => {
    if (!roomId || !currentUserId) return

    const unsubscribeNewMessage = onNewMessage((newMessage: MessageData) => {
      console.log('New message received:', newMessage)
      
      // Only add message if it belongs to current room
      if (newMessage.roomId === roomId) {
        const uiMessage = convertSocketMessageToUI(newMessage, currentUserId)
        
        setMessages(prev => {
          // Check if message already exists to prevent duplicates
          const exists = prev.some(msg => msg.id === uiMessage.id)
          if (exists) return prev
          
          return [...prev, uiMessage]
        })
        setLastMessage(uiMessage)
      }
    })

    return unsubscribeNewMessage
  }, [roomId, currentUserId, onNewMessage])

  // Listen for message seen updates
  useEffect(() => {
    if (!roomId) return

    const unsubscribeMessagesSeen = onMessagesSeen((seenData) => {
      console.log('Messages seen:', seenData)
      
      if (seenData.roomId === roomId) {
        setMessages(prev => 
          prev.map(msg => 
            seenData.messageIds.includes(msg.id)
              ? { ...msg, status: 'read' as const }
              : msg
          )
        )
      }
    })

    return unsubscribeMessagesSeen
  }, [roomId, onMessagesSeen])

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => {
      const exists = prev.some(msg => msg.id === message.id)
      if (exists) return prev
      return [...prev, message]
    })
  }, [])

  const updateMessageStatus = useCallback((messageId: string, status: Partial<Message>) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, ...status } : msg
      )
    )
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
    setLastMessage(null)
  }, [])

  return {
    messages,
    lastMessage,
    addMessage,
    updateMessageStatus,
    clearMessages,
    setMessages
  }
}

// Hook for typing indicators
export const useTypingIndicator = (roomId: string | null) => {
  const { startTyping, stopTyping, onUserTyping, onUserStoppedTyping } = useSocket()
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
  const typingTimeout = useRef<NodeJS.Timeout | null>(null)
  const isTyping = useRef(false)

  // Listen for typing events
  useEffect(() => {
    if (!roomId) return

    console.log('Setting up typing listeners for room:', roomId)

    const unsubscribeTyping = onUserTyping((data) => {
      console.log('Received typing event:', data)
      if (data.roomId === roomId) {
        console.log(`User ${data.userId} is typing in room ${data.roomId}`)
        setTypingUsers(prev => new Set([...prev, data.userId]))
      }
    })

    const unsubscribeStoppedTyping = onUserStoppedTyping((data) => {
      console.log('Received stopped typing event:', data)
      if (data.roomId === roomId) {
        console.log(`User ${data.userId} stopped typing in room ${data.roomId}`)
        setTypingUsers(prev => {
          const newSet = new Set(prev)
          newSet.delete(data.userId)
          return newSet
        })
      }
    })

    return () => {
      console.log('Cleaning up typing listeners for room:', roomId)
      unsubscribeTyping()
      unsubscribeStoppedTyping()
    }
  }, [roomId, onUserTyping, onUserStoppedTyping])

  // Handle user typing
  const handleTyping = useCallback(() => {
    if (!roomId) return

    console.log('handleTyping called for room:', roomId)

    if (!isTyping.current) {
      console.log('Starting typing indicator')
      startTyping(roomId)
      isTyping.current = true
    }

    // Clear existing timeout
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current)
    }

    // Set new timeout to stop typing after 2 seconds
    typingTimeout.current = setTimeout(() => {
      if (isTyping.current) {
        console.log('Auto-stopping typing indicator after timeout')
        stopTyping(roomId)
        isTyping.current = false
      }
    }, 2000)
  }, [roomId, startTyping, stopTyping])

  const handleStopTyping = useCallback(() => {
    if (!roomId || !isTyping.current) return

    console.log('handleStopTyping called for room:', roomId)

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current)
    }

    stopTyping(roomId)
    isTyping.current = false
  }, [roomId, stopTyping])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current)
      }
    }
  }, [])

  return {
    typingUsers: Array.from(typingUsers),
    handleTyping,
    handleStopTyping,
    isUserTyping: isTyping.current
  }
}

// Hook for online status
export const useOnlineStatus = () => {
  const { onlineUsers, onOnlineUsers } = useSocket()
  const [onlineUsersList, setOnlineUsersList] = useState<string[]>([])

  useEffect(() => {
    setOnlineUsersList(onlineUsers)
  }, [onlineUsers])

  useEffect(() => {
    const unsubscribe = onOnlineUsers((users) => {
      setOnlineUsersList(users)
    })

    return unsubscribe
  }, [onOnlineUsers])

  const isUserOnline = useCallback((userId: string) => {
    return onlineUsersList.includes(userId)
  }, [onlineUsersList])

  return {
    onlineUsers: onlineUsersList,
    isUserOnline
  }
}

// Hook for connection status with visual indicator
export const useConnectionStatus = () => {
  const { isConnected, connect, disconnect } = useSocket()
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected')

  useEffect(() => {
    if (isConnected) {
      setConnectionState('connected')
    } else {
      setConnectionState('disconnected')
    }
  }, [isConnected])

  const reconnect = useCallback(() => {
    setConnectionState('connecting')
    disconnect()
    setTimeout(() => {
      connect()
    }, 1000)
  }, [connect, disconnect])

  return {
    connectionState,
    isConnected,
    reconnect
  }
}