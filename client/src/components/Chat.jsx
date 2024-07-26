import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import EmojiPicker from 'emoji-picker-react';

const socket = io('https://mern-estate-fp7e.onrender.com');


const linkify = (text) => {
  const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|$!:,.;]*[-A-Z0-9+&@#/%=~_|$])/gi;
  return text.replace(urlPattern, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="dark:text-white hover:underline">${url}</a>`;
  });
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const endOfMessagesRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
   
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/chat');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
      if (isAtBottom) {
        scrollToBottom();
      }
    });

    return () => {
      socket.off('chat message');
    };
  }, [isAtBottom]);

  useEffect(() => {
    
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10);
    }
  };

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const timestamp = new Date().toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
    const msg = { username: currentUser.username, avatar: currentUser.avatar, message, timestamp };
    socket.emit('chat message', msg);
    setMessage('');
    setShowEmojiPicker(false)
  };

  const onEmojiClick = (emojiData) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
  };

  return (
    <div className="max-w-2xl mx-auto mt-28 p-4 bg-white dark:bg-darkblue shadow-md rounded-md h-[40rem] flex flex-col relative">
      <div
        className="flex-grow overflow-y-auto mb-4 scrollbar-hide"
        ref={chatContainerRef}
        onScroll={handleScroll}
      >
        <ul className="space-y-2">
          {messages.map((msg, index) => (
            <li
              key={index}
              className={`flex ${
                msg.username === currentUser.username ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`p-2 rounded-md flex items-center max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl ${
                  msg.username === currentUser.username
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                }`}
              >
                <img
                  src={msg.avatar}
                  alt="profile"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div>
                  <div className="flex items-center mb-1">
                    <span className="text-sm font-semibold">{msg.username}</span>
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-300">
                      {msg.timestamp}
                    </span>
                  </div>
                  <span
                    className="text-sm break-all"
                    dangerouslySetInnerHTML={{ __html: linkify(msg.message) }}
                  />
                </div>
              </div>
            </li>
          ))}
          <div ref={endOfMessagesRef} />
        </ul>
      </div>
      {!isAtBottom && (
        <button
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 p-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 focus:outline-none"
          onClick={scrollToBottom}
        >
          ↓
        </button>
      )}
      <div className="relative">
        {showEmojiPicker && (
          <div className="absolute bottom-full mb-2">
            <EmojiPicker className='dark:bg-slate-800' onEmojiClick={onEmojiClick} />
          </div>
        )}
        
        <form className="flex-grow flex" onSubmit={sendMessage}>
          <button
          type="button"
          className="p-2 bg-blue-500 text-white rounded-l-md hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          😊
        </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow p-2 border border-gray-300  dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
