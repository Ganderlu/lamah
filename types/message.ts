export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  message: string;
  read: boolean;
  createdAt: string;
}
