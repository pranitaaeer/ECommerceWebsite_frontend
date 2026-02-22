import React, { useState, useEffect, useRef } from "react";
import { GoCopilot } from "react-icons/go";
import { FaArrowUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useSendMessageMutation } from "../redux/api/chatAPI";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  isOrderList?: boolean;
  isProductList?: boolean;
  ordersData?: any[]; // Dynamic data handling
  productsData?: any[];
}

const Chatbot: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const [sendMessage] = useSendMessageMutation();

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: `Hi ${user?.username}! How can I help you today?`, sender: "bot" },
  ]);

  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOrderSelection = (order: any) => {
    // Backend 'item' ko UI ke liye 'ProductName' ki tarah treat karein
    const itemName = order.orderItems ? order.orderItems[0].ProductName : order.item;
    
    const userMsg: Message = { 
      id: Date.now(), 
      text: `Checking status for ${itemName}`, 
      sender: "user" 
    };
    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      let dayMessage = "";
      if (order.status === "Shipped") dayMessage = "Expected delivery within 15 days.";
      else if (order.status === "Processing") dayMessage = "Expected delivery within 6 days.";
      else if (order.status === "Delivered") dayMessage = "Your order has been delivered.";
      else dayMessage = "Your order not shipped yet.";

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: `Your order (${itemName}) is in "${order.status}" state. ${dayMessage}`,
          sender: "bot",
        },
      ]);
    }, 800);
  };

  const handleResponse = async (query: string) => {
    if (!query.trim()) return;

    const userMsg: Message = { id: Date.now(), text: query, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const typingId = Date.now() + 2;
    setMessages((prev) => [...prev, { id: typingId, text: "Bot is typing...", sender: "bot" }]);

    try {
      const res = await sendMessage({ userId: user!._id, message: query }).unwrap();
      
      // MAPPING: Backend response ko Frontend format mein dhaalna
      const mappedOrders = res.orders?.map((o: any) => ({
        ...o,
        _id: o._id || Math.random().toString(),
        orderItems: [{ ProductName: o.item }] // Backend 'item' -> UI 'ProductName'
      })) || [];

      const mappedProducts = res.products?.map((p: any) => ({
        ...p,
        _id: p._id || Math.random().toString(),
        ProductName: p.name // Backend 'name' -> UI 'ProductName'
      })) || [];

      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== typingId);
        return [
          ...filtered,
          {
            id: Date.now() + 3,
            text: res.reply,
            sender: "bot",
            isOrderList: mappedOrders.length > 0,
            isProductList: mappedProducts.length > 0,
            ordersData: mappedOrders,
            productsData: mappedProducts,
          },
        ];
      });
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== typingId));
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 4, text: "Oops! Something went wrong.", sender: "bot" },
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
                {/* 1. Bot Greeting Logic */}
                  {m.sender === "bot" && m.id === 1 ? (
                    // Agar koi user message nahi hai, toh greeting dikhao
                    messages.filter((msg) => msg.sender === "user").length === 0 ? (
                      <div className="bot-greeting">
                        <div className="greeting">✨ Hi {user?.username}</div>
                        <div className="prompt">Where should we start?</div>
                      </div>
                    ) : (
                      null
                    )
                  ) : (
                    // Baaki sab normal messages ke liye
                    <div className={`message ${m.sender}`}>{m.text}</div>
                  )}

                {/* --- Orders Section --- */}
                {m.isOrderList && m.ordersData && (
                  <div className="order-options">
                    {m.ordersData.map((order) => (
                      <button key={order._id} onClick={() => handleOrderSelection(order)} className="order-btn">
                        <p>📦 <strong>{order.orderItems[0].ProductName}</strong></p>
                        <p style={{color:"blue"}}>Status: ₹{order.status}</p>
                      </button>
                    ))}
                  </div>
                )}

                {/* --- Products Section --- */}
                {m.isProductList && m.productsData && (
                  <div className="product-list">
                    {m.productsData.map((product) => (
                      <div key={product._id} className="product-btn">
                        <p>🛍️ <strong >{product.ProductName}</strong></p>
                        <p style={{color:"green"}}>Price: ₹{product.price}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

            <div className="quick-replies">
              <button onClick={() => handleResponse("please tell me order status?")}>Order Status</button>
              <button onClick={() => handleResponse("show me products")}>Show Products</button>
              <button onClick={() => handleResponse("show me orders")}>Show Orders</button>
              <button onClick={() => handleResponse("cancel my order")}>Cancel Order</button>
            </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleResponse(input)}
              placeholder="Type your message..."
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