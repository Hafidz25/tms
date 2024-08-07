export interface Feedback {
  id: string;
  content: string;
  userId: string;
  briefId: string;
  userSentId: string;
  status: string;
  isReply: boolean;
  replyId: string;
  isEdited: boolean;
  createdAt: string;
}
