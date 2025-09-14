'use client'

import React from 'react'
import { Wifi, WifiOff, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useConnectionStatus } from '@/hooks/useChat'

export const ConnectionStatus: React.FC = () => {
  const { connectionState, reconnect } = useConnectionStatus()

  if (connectionState === 'connected') {
    return null 
  }

  const getStatusConfig = () => {
    switch (connectionState) {
      case 'connecting':
        return {
          icon: <RefreshCw className="h-4 w-4 animate-spin" />,
          text: 'Connecting...',
          bgColor: 'bg-yellow-500',
          textColor: 'text-yellow-50'
        }
      case 'disconnected':
        return {
          icon: <WifiOff className="h-4 w-4" />,
          text: 'Disconnected',
          bgColor: 'bg-red-500',
          textColor: 'text-red-50'
        }
      case 'error':
        return {
          icon: <WifiOff className="h-4 w-4" />,
          text: 'Connection Error',
          bgColor: 'bg-red-600',
          textColor: 'text-red-50'
        }
      default:
        return {
          icon: <Wifi className="h-4 w-4" />,
          text: 'Connected',
          bgColor: 'bg-green-500',
          textColor: 'text-green-50'
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg ${config.bgColor} ${config.textColor} shadow-lg`}>
      {config.icon}
      <span className="text-sm font-medium">{config.text}</span>
      {connectionState === 'disconnected' && (
        <Button
          size="sm"
          variant="ghost"
          onClick={reconnect}
          className="h-6 px-2 text-xs hover:bg-white/20"
        >
          Retry
        </Button>
      )}
    </div>
  )
}

export default ConnectionStatus