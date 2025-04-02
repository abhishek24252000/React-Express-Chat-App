import React, { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';

function ChatContainer() {
  const { messages, getMessages, isMessagesLoading, selectedUser } =
    useChatStore();

  useEffect(() => {
    getMessages(selectedUser._id);
  }, [getMessages, selectedUser._id]);

  if (isMessagesLoading)
    return <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader/>
      <MessageSkeleton/>
      <MessageInput/>
    </div>;

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <p>mes</p>

      <MessageInput />
    </div>
  );
}

export default ChatContainer;
