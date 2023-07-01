'use client';

const MessageBubble = ({ message }: { message: Message }) => {
  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';

  return <div>{message.data}</div>;
};

export default MessageBubble;
