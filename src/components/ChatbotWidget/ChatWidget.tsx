// components/YourFloatingChatWidget.tsx
'use client' // only for App Router (Next.js 13+)

import React, { useState } from 'react';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50">
    {isOpen && (
      <div className={`transform transition-all duration-300 ease-in-out origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} bg-white w-80 h-96 shadow-lg rounded-lg p-4 border border-gray-300 flex flex-col`}>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Chat Support</h3>
          <button onClick={() => setIsOpen(false)}>&times;</button>
        </div>

        {/* Chat Content Area */}
        <div className="flex-1 overflow-y-auto text-sm text-gray-600 mb-2">
          {/* Replace this with your chat messages */}
          <p>How can we help you today?</p>
          {/* Add more messages here */}
        </div>

        {/* Input Field at Bottom */}
        <div className="pt-2 border-t">
          <input
            type="text"
            name="user_input"
            id="user_input"
            placeholder="Type your message..."
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    )}

    {/* Chat Button */}
    {!isOpen && (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white p-3 mb-25 rounded-full shadow-lg hover:bg-blue-700"
      >
        💬 Chat With Sales
      </button>
    )}
  </div>

  );
};

export default ChatWidget;
