// Chat Types
export interface Message {
  id: string;
  text: string;
  messageType: 'text' | 'image' | 'voice' | 'video' | 'file';
  senderId: string;
  timestamp: Date;
  isOwn: boolean;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  mediaUrl?: string;
  fileName?: string;
  fileSize?: number;
  duration?: number; // for voice messages
  replyTo?: {
    messageId: string;
    content: string;
    messageType: string;
  };
  reactions?: {
    userId: string;
    emoji: string;
    reactedAt: Date;
  }[];
  isEdited?: boolean;
  editedAt?: Date;
  image?: {
    url: string;
    publicId: string;
  };
}

export interface SocketMessageData {
  _id: string;
  roomId: string;
  sender: string;
  message: string;
  messageType: 'text' | 'image' | 'voice' | 'video' | 'file';
  createdAt: string;
  seenStatus: boolean;
  image?: {
    url: string;
    publicId: string;
  };
}

export interface ChatUser {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
  profilePicture?: string;
}

export interface Chat {
  id: string;
  roomId: string;
  participants: ChatUser[];
  lastMessage?: Message;
  unreadCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatRoom {
  id: string;
  roomId: string;
  participants: ChatUser[];
  messages: Message[];
  isActive: boolean;
  roomType: 'direct' | 'group';
  createdAt: Date;
  updatedAt: Date;
}

// Speech Recognition Types
export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onstart: (() => void) | null;
  onend: (() => void) | null;
}

export interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

export interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}
