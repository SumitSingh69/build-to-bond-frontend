import { Message } from "../types";
import { MessageData } from "@/context/SocketContext";

const mapSocketTypeToUI = (
  socketType: "text" | "image" | "audio"
): "text" | "image" | "voice" | "video" | "file" => {
  switch (socketType) {
    case "audio":
      return "voice";
    case "text":
      return "text";
    case "image":
      return "image";
    default:
      return "text";
  }
};

const mapUITypeToSocket = (
  uiType: "text" | "image" | "voice" | "video" | "file"
): "text" | "image" | "audio" => {
  switch (uiType) {
    case "voice":
      return "audio";
    case "text":
      return "text";
    case "image":
      return "image";
    default:
      return "text";
  }
};

export const convertSocketMessageToUI = (
  socketMessage: MessageData,
  currentUserId: string
): Message => {
  return {
    id: socketMessage._id,
    text: socketMessage.message,
    messageType: mapSocketTypeToUI(socketMessage.messageType),
    senderId: socketMessage.sender,
    timestamp: new Date(socketMessage.createdAt),
    isOwn: socketMessage.sender === currentUserId,
    status: socketMessage.seenStatus ? "read" : "delivered",
    image: socketMessage.image,
  };
};

export const convertUIMessageToSocket = (
  uiMessage: Message
): Partial<MessageData> => {
  return {
    _id: uiMessage.id,
    message: uiMessage.text,
    messageType: mapUITypeToSocket(uiMessage.messageType),
    sender: uiMessage.senderId,
    createdAt: uiMessage.timestamp,
    updatedAt: uiMessage.timestamp,
    seenStatus: uiMessage.status === "read",
    seenAt: uiMessage.status === "read" ? uiMessage.timestamp : undefined,
    image: uiMessage.image,
    roomId: "",
  };
};
