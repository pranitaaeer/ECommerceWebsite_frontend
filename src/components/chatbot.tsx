import React, { useState, useEffect, useRef } from "react";
import { GoCopilot } from "react-icons/go";
import { FaArrowUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useSendMessageMutation } from "../redux/api/chatAPI";
import { Order } from "../types/types";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  isOrderList?: boolean; // Agar bot orders bheje, buttons show karne ke liye
}

const Chatbot: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const [sendMessage, { isLoading }] = useSendMessageMutation();

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: `Hi ${user?.username}! How can I help you?`, sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Handle user clicking an order
  const handleOrderSelection = (order: Order) => {
    const userChoice: Message = {
      id: Date.now(),
      text: `Checking status for ${order.orderItems[0].ProductName}`,
      sender: "user",
    };
    setMessages((prev) => [...prev, userChoice]);

    setTimeout(() => {
      let dayMessage = "";
      if (order.status === "Shipped") dayMessage = "Expected delivery within 15 days.";
      else if (order.status === "Processing") dayMessage = "Expected delivery within 6 days.";
      else if (order.status === "Delivered") dayMessage = "Your order has been delivered.";
      else dayMessage = "Your order not shipped yet.";

      const botReply: Message = {
        id: Date.now() + 1,
        text: `Your order (${order.orderItems[0].ProductName}) is in "${order.status}" state. ${dayMessage}`,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botReply]);
    }, 800);
  };

  // Handle sending a message
  const handleResponse = async (query: string) => {
  if (!query.trim()) return;

  // 1️⃣ Add user message
  const userMsg: Message = { id: Date.now(), text: query, sender: "user" };
  setMessages((prev) => [...prev, userMsg]);
  setInput("");

  // 2️⃣ Check internet connection
  if (!navigator.onLine) {
    setMessages((prev) => [
      ...prev,
      { 
        id: Date.now() + 1, 
        text: "You're offline. Please check your internet connection.", 
        sender: "bot" 
      },
    ]);
    return;
  }

  // 3️⃣ Show typing indicator
  const typingMsg: Message = { id: Date.now() + 2, text: "Bot is typing...", sender: "bot" };
  setMessages((prev) => [...prev, typingMsg]);

  try {
    const payload = { userId: user!._id, message: query };
    const res = await sendMessage(payload).unwrap();

    // 4️⃣ Remove typing indicator
    setMessages((prev) => prev.filter((m) => m.id !== typingMsg.id));

    // 5️⃣ Handle response
    if (res.orders && res.orders.length > 0) {
      setUserOrders(res.orders);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 3, text: res.reply, sender: "bot", isOrderList: true },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 3, text: res.reply, sender: "bot" },
      ]);
    }
  } catch (err: any) {
    console.error("Chatbot error:", err);

    // 6️⃣ Remove typing indicator if error
    setMessages((prev) => prev.filter((m) => m.id !== typingMsg.id));

    // 7️⃣ Show friendly error message
    setMessages((prev) => [
      ...prev,
      { 
        id: Date.now() + 4, 
        text: "Oops! I'm unable to fetch the response right now. Please try again later.", 
        sender: "bot" 
      },
    ]);
  }
};


  return (
    <>
      <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✖" : <GoCopilot size={26} />}
      </button>

      {isOpen && (
        <div className="chatbot-container">
          <div className="chat-header">
            <GoCopilot size={25} /> <h3>ShopeeBuddy</h3>
          </div>

          <div className="chat-window">
              {messages.map((m) => (
                <div key={m.id} className="message-wrapper">
                  {m.sender === "bot" && m.id === 1 ? (
                    <div className="bot-greeting">
                      <div className="greeting">✨ Hi {user?.username}</div>
                      <div className="prompt">Where should we start?</div>
                    </div>
                  ) : (
                    <div className={`message ${m.sender}`}>{m.text}</div>
                  )}

                  {/* Orders buttons */}
                  {m.isOrderList && m.id === messages[messages.length - 1].id && (
                    <div className="order-options">
                      {userOrders.map((order) => (
                        <button
                          key={order._id}
                          onClick={() => handleOrderSelection(order)}
                          className="order-btn"
                        >
                          📦 {order.orderItems[0].ProductName}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
  ))}
  <div ref={chatEndRef} />
</div>


          {/* Quick Replies */}
          {messages.length === 1 && (
            <div className="quick-replies">
              <button onClick={() => handleResponse("please tell me order status?")}>
                Order Status
              </button>
              <button onClick={() => handleResponse("why is my order delayed?")}>
                Order Delay
              </button>
              <button onClick={() => handleResponse("i want to change my address")}>
                Address change
              </button>
              <button onClick={() => handleResponse("i want to cancel my order")}>
                Cancel Order
              </button>
            </div>
          )}

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleResponse(input)}
              placeholder="Type..."
            />
            <button onClick={() => handleResponse(input)}>
              <FaArrowUp size={20} className="send" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
