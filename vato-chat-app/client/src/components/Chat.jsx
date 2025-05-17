import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const socketRef = useRef();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const room = 'global';

  useEffect(() => {
    // Fetch chat history
    fetch(`http://localhost:3000/api/messages/${room}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setMessages)
      .catch(console.error);

    // Connect socket
    socketRef.current = io('http://localhost:3000', { withCredentials: true });

    // Join room
    socketRef.current.emit('joinRoom', { room });

    // Listen for new messages
    socketRef.current.on('newMessage', msg => {
      setMessages(prev => [...prev, msg]);
    });

    return () => socketRef.current.disconnect();
  }, []);

  const sendMessage = e => {
    e.preventDefault();
    if (!content.trim()) return;
    socketRef.current.emit('sendMessage', {
      room,
      content,
      senderId: user.id,
    });
    setContent('');
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map(m => (
          <div key={m._id}>
            <strong>{m.sender.name}:</strong> {m.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="input-form">
        <input
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
