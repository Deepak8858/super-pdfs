"use client";

import { useState } from "react";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
}

export default function ChatPage({
  params,
}: {
  params: { pdfName: string };
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessages: ChatMessage[] = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, pdfName: params.pdfName }),
    });

    const { response } = await res.json();
    setMessages([...newMessages, { sender: "ai", text: response }]);
  };

  return (
    <div className="container mx-auto p-4 flex flex-col h-screen">
      <h1 className="text-2xl font-bold mb-4">Chat with {params.pdfName}</h1>
      <div className="flex-grow border rounded-lg p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : ''}`}>
            <span className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-grow border rounded-l-lg p-2"
        />
        <button onClick={handleSendMessage} className="bg-blue-500 text-white p-2 rounded-r-lg">
          Send
        </button>
      </div>
    </div>
  );
}
