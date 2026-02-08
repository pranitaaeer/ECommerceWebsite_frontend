import React, { useState, useEffect, useRef } from 'react';
import { GoCopilot } from "react-icons/go";
import { FaArrowUp } from "react-icons/fa";
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  isOrderList?: boolean; // Naya flag orders dikhane ke liye
}

interface Order {
  id: string;
  item: string;
  status: string;
  deliveryDate: string;
}
let username = "pranita";
const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: `hi ${username}! how can I help you?`, sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [userOrders, setUserOrders] = useState<Order[]>([]); 
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Dummy Backend Call (Isse real API se replace karna)
  const fetchOrdersFromBackend = async () => {
    // const response = await fetch('/api/my-orders');
    // const data = await response.json();
    return [
      { id: 'ORD123', item: 'Nike Shoes', status: 'Shipped', deliveryDate: '12 Feb' },
      { id: 'ORD456', item: 'iPhone Case', status: 'Delayed', deliveryDate: '15 Feb' }
    ];
  };

  const handleOrderSelection = (order: Order) => {
    const userChoice: Message = { id: Date.now(), text: `Checking status for ${order.item}`, sender: 'user' };
    setMessages(prev => [...prev, userChoice]);

    setTimeout(() => {
      const botReply: Message = { 
        id: Date.now() + 1, 
        text: `Aapka order (${order.id}) abhi "${order.status}" state mein hai. Expected delivery: ${order.deliveryDate}.`, 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botReply]);
    }, 800);
  };

  const handleResponse = async (query: string) => {
    if (!query.trim()) return;
    
    const userMsg: Message = { id: Date.now(), text: query, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);

    setTimeout(async () => {
      const text = query.toLowerCase();
      let botMsg: Message = { id: Date.now() + 1, text: "", sender: 'bot' };

      if (text.includes('status') || text.includes('delay')) {
        const orders = await fetchOrdersFromBackend(); 
        setUserOrders(orders);
        
        botMsg.text = "which order do you want to check?";
        botMsg.isOrderList = true; // Isse hum niche buttons dikhayenge
      } 
      else if (text.includes('cancel')) {
        botMsg.text = "if you want to cancel an order, please go to 'My Orders' section and select the order you want to cancel.";
      } 
      else {
        botMsg.text = "i am not able to help with that";
      }

      setMessages(prev => [...prev, botMsg]);
    }, 800);
  };

  return (
    <>
      <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✖' : <GoCopilot size={26} />}
      </button>

      {isOpen && (
        <div className="chatbot-container">
          <div className="chat-header"> <GoCopilot size={25}/> <span><h3>ShopeeBuddy</h3></span></div>
          
          <div className="chat-window">
            {messages.map(m => (
              <div key={m.id} className="message-wrapper">
                <div className={`message ${m.sender}`}>{m.text}</div>
                
                {/* Agar bot ne orders fetch kiye hain toh buttons dikhao */}
                {m.isOrderList && m.id === messages[messages.length - 1].id && (
                  <div className="order-options">
                    {userOrders.map(order => (
                      <button key={order.id} onClick={() => handleOrderSelection(order)} className="order-btn">
                        📦 {order.item} ({order.id})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Buttons (Only show at start) */}
          {messages.length === 1 && (
            <div className="quick-replies">
              <button onClick={() => handleResponse("please tell me order status?")}>Order Status</button>
              <button onClick={() => handleResponse("why is my order delayed?")}>Order Delay</button>
              <button onClick={() => handleResponse("i want to change my address")}>Address change</button>
                <button onClick={() => handleResponse("i want to cancel my order")}>Cancel Order</button>
            </div>
          )}

          <div className="chat-input">
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (handleResponse(input), setInput(''))}
              placeholder="Type..."
            />
            <button onClick={() => { handleResponse(input); setInput(''); }}>
                <FaArrowUp size={20}  className='send'/>
                </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;