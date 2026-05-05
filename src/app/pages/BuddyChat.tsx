import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Send, Smile } from "lucide-react";
import { getBuddies } from "../utils/buddyStorage";
import { getChatMessages, saveChatMessage, markMessagesAsRead, simulateBuddyMessage, type ChatMessage } from "../utils/chatStorage";

export default function BuddyChat() {
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!username) {
      navigate('/buddy');
      return;
    }

    const buddies = getBuddies();
    const buddy = buddies.find(b => b.name === username);
    if (!buddy) {
      navigate('/buddy');
      return;
    }

    // Load messages
    const loadMessages = () => {
      const chatMessages = getChatMessages(username);
      setMessages(chatMessages);
      markMessagesAsRead(username);
    };

    loadMessages();

    // Listen for new messages
    const handleNewMessage = (event: CustomEvent) => {
      if (event.detail.buddyName === username) {
        loadMessages();
      }
    };

    window.addEventListener('new-chat-message', handleNewMessage as EventListener);

    return () => {
      window.removeEventListener('new-chat-message', handleNewMessage as EventListener);
    };
  }, [username, navigate]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !username) return;

    const newMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random()}`,
      buddyName: username,
      message: inputMessage.trim(),
      sender: 'me',
      timestamp: new Date().toISOString(),
      read: true,
    };

    saveChatMessage(newMessage);
    setMessages([...messages, newMessage]);
    setInputMessage("");

    // Simulate buddy response
    simulateBuddyMessage(username, 2000);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Group messages by date
  const groupedMessages: { [key: string]: ChatMessage[] } = {};
  messages.forEach(msg => {
    const date = formatDate(msg.timestamp);
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(msg);
  });

  return (
    <div className="bg-[#f2f1ec] relative size-full flex flex-col">
      {/* Header - Fixed */}
      <div className="flex-none h-[80px] flex items-center justify-between px-6 border-b border-black/5 bg-white">
        <button
          onClick={() => navigate('/buddy')}
          className="w-10 h-10 rounded-full bg-[#f5f3ff] flex items-center justify-center hover:bg-[#834dfb]/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#180f2a]" strokeWidth={2.5} />
        </button>

        <div className="text-center">
          <h1 className="font-['Manrope:Bold',sans-serif] font-bold text-[18px] text-[#180f2a]">
            {username}
          </h1>
          <p className="font-['Manrope:Regular',sans-serif] text-[12px] text-[#180f2a]/60">
            Buddy Chat
          </p>
        </div>

        <button
          className="w-10 h-10 rounded-full bg-[#f5f3ff] flex items-center justify-center hover:bg-[#834dfb]/10 transition-colors"
        >
          <Smile className="w-5 h-5 text-[#180f2a]" strokeWidth={2} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-[600px] mx-auto space-y-4">
          {Object.entries(groupedMessages).length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-[#834dfb]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smile className="w-10 h-10 text-[#834dfb]" strokeWidth={2} />
              </div>
              <p className="font-['Manrope:SemiBold',sans-serif] text-[16px] text-[#180f2a] mb-2">
                Start a conversation
              </p>
              <p className="font-['Manrope:Regular',sans-serif] text-[13px] text-[#180f2a]/60">
                Send a message to {username}!
              </p>
            </div>
          ) : (
            Object.entries(groupedMessages).map(([date, msgs]) => (
              <div key={date}>
                {/* Date Divider */}
                <div className="flex items-center justify-center my-4">
                  <div className="bg-[#180f2a]/10 px-4 py-1 rounded-full">
                    <p className="font-['Manrope:SemiBold',sans-serif] text-[11px] text-[#180f2a]/60">
                      {date}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                {msgs.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} mb-3`}
                  >
                    <div
                      className={`max-w-[75%] rounded-[16px] px-4 py-3 ${
                        msg.sender === 'me'
                          ? 'bg-[#834dfb] text-white'
                          : 'bg-white border border-black/5 text-[#180f2a]'
                      }`}
                    >
                      <p className="font-['Manrope:Regular',sans-serif] text-[14px] break-words">
                        {msg.message}
                      </p>
                      <p
                        className={`font-['Manrope:Regular',sans-serif] text-[10px] mt-1 ${
                          msg.sender === 'me' ? 'text-white/60' : 'text-[#180f2a]/40'
                        }`}
                      >
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed */}
      <div className="flex-none bg-white border-t border-black/5 px-6 py-4">
        <div className="max-w-[600px] mx-auto flex gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-[#f5f3ff] border-2 border-[#834dfb]/20 rounded-[16px] px-4 py-3 text-[15px] font-['Manrope:Regular',sans-serif] focus:outline-none focus:border-[#834dfb] transition-colors"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="w-12 h-12 bg-[#834dfb] rounded-[16px] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.95] transition-all"
          >
            <Send className="w-5 h-5 text-white" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
