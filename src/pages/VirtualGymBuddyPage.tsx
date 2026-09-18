import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Flame,
  Dumbbell,
  Smile,
  HelpCircle,
  Zap,
  RotateCcw
} from 'lucide-react';
import { ChatMessage, UserProfile } from '../types';
import { api } from '../services/api';

interface VirtualGymBuddyPageProps {
  profile: UserProfile;
  currentStreak: number;
}

export const VirtualGymBuddyPage: React.FC<VirtualGymBuddyPageProps> = ({ profile, currentStreak }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [detectedSentiment, setDetectedSentiment] = useState<string>('Focused & Inquisitive');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const starterPrompts = [
    "I'm feeling fatigued today. Should I still do my heavy squats?",
    "How can I fix lower-back rounding during my squat descent?",
    "What's the optimal post-workout protein timing?",
    "Can you give me a 15-minute quick arm burnout circuit?",
    "I only have 3 days a week to train. How should I structure my split?"
  ];

  const fetchHistory = async () => {
    try {
      const history = await api.getChatHistory();
      setMessages(history);
    } catch (err) {
      console.error('Error fetching chat history:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsSending(true);

    // Simple sentiment inference indicator
    const lower = text.toLowerCase();
    if (lower.includes('tired') || lower.includes("don't feel like") || lower.includes('skip') || lower.includes('exhausted')) {
      setDetectedSentiment('Fatigued / Needs Motivation');
    } else if (lower.includes('how') || lower.includes('why') || lower.includes('depth') || lower.includes('form')) {
      setDetectedSentiment('Biomechanical Inquiry');
    } else {
      setDetectedSentiment('Positive Athletic Mindset');
    }

    try {
      const res = await api.sendChat(text, [...messages, userMsg]);
      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: res.reply,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Error in AI Gym Buddy chat:', err);
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: "I am having temporary connectivity trouble to the neural processor. Remember to keep proper form and hydrate well!",
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4 pb-12 h-[calc(100vh-6.5rem)] flex flex-col">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5" /> Gemini Flash Engine
            </span>
            <span className="text-xs text-slate-400">Contextual Fitness Intelligence</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Virtual Gym Buddy &amp; AI Coach
          </h1>
        </div>

        {/* User Context Awareness HUD */}
        <div className="flex items-center gap-2 text-xs bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl">
          <div className="flex items-center gap-1 text-orange-400 font-semibold">
            <Flame className="w-3.5 h-3.5 fill-orange-500" />
            <span>{currentStreak}d Streak</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 font-medium capitalize">
            Goal: {profile.fitnessGoal.replace('_', ' ')}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400 font-medium hidden md:inline">
            Sentiment: {detectedSentiment}
          </span>
        </div>
      </div>

      {/* Main Chat Box Container */}
      <div className="flex-1 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col overflow-hidden shadow-xl min-h-0">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isBot = msg.sender === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-2xl ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                    isBot
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                      : 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isBot
                      ? 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-sm'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-sm shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1.5 ${
                      isBot ? 'text-slate-500' : 'text-cyan-100 text-right'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex gap-3 max-w-2xl mr-auto items-center">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 rounded-tl-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce delay-100" />
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce delay-200" />
                <span className="text-xs text-slate-400 ml-1">Gym Buddy is formulating response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Suggestions */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 overflow-x-auto flex gap-2 shrink-0">
          {starterPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition-colors shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask your Gym Buddy about workouts, form, recovery, or motivation..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-purple-500 outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-purple-950 transition-all"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
