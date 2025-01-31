interface MessageBubbleProps {
  content: string;
  isAI?: boolean;
}

const MessageBubble = ({ content, isAI = false }: MessageBubbleProps) => {
  return (
    <div
      className={`flex ${isAI ? "justify-start" : "justify-end"} animate-fade-in`}
    >
      <div
        className={`max-w-[80%] p-4 rounded-2xl ${
          isAI
            ? "bg-secondary text-secondary-foreground"
            : "bg-primary text-primary-foreground"
        }`}
      >
        {content}
      </div>
    </div>
  );
};

export default MessageBubble;