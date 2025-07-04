// Chatbot.js
import React, { useState } from 'react';
import '../App.css';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi there! How can I help you today?' },
  ]);

  const predefinedQuestions = [
    {
      question: "How can I donate food?",
      answer: "Click on the 'Become a Donor' button and register your food donation details.",
    },
    {
      question: "Is the donation pickup free?",
      answer: "Yes, pickup is completely free through our verified NGO volunteers.",
    },
    {
      question: "Can I track my donation?",
      answer: "Yes! You’ll receive updates once your food is picked and delivered.",
    },
  ];

  const handleQuestionClick = (q) => {
    setMessages((prev) => [
      ...prev,
      { type: 'user', text: q.question },
      { type: 'bot', text: q.answer },
    ]);
  };

  return (
    <div className="chatbot-wrapper">
      {isOpen && (
        <div className="chatbot-box">
          <div className="chatbot-header">
            🤖 Ask ShareMyThali
            <span onClick={() => setIsOpen(false)} className="close-btn">×</span>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbot-questions">
            {predefinedQuestions.map((q, i) => (
              <button key={i} onClick={() => handleQuestionClick(q)}>{q.question}</button>
            ))}
          </div>
        </div>
      )}

      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        💬
      </button>
    </div>
  );
}

export default Chatbot;
