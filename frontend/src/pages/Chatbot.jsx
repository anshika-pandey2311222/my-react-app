import React, { useState, useEffect, useRef } from "react";
import { Menu, X, Trash2, Code, HelpCircle, RefreshCw, Layers, Send, Sparkles, AlertTriangle } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function Chatbot({ backendUrl }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const STORAGE_KEY = "algomate_chat_history";

  // Use explicit fallback URL if prop is undefined/empty
  const targetBackendUrl = backendUrl && backendUrl.trim() !== "" ? backendUrl : "http://127.0.0.1:5000";

  // Load chat history from sessionStorage or initialize default welcome message
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved chat history from sessionStorage", e);
      }
    }
    return [
      {
        role: "bot",
        text: "👋 Hello! I am **AlgoMate AI**, your dedicated DSA & Programming assistant. Ask me any Data Structures or Algorithms question!"
      }
    ];
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const bottomRef = useRef(null);

  // Sync message state changes to sessionStorage & auto-scroll to bottom
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (customPrompt = null) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = { role: "user", text: textToSend };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!customPrompt) setInput("");
    
    setLoading(true);
    setErrorMessage(null);

    try {
      const endpoint = `${targetBackendUrl}/chat`;
      console.log(`[AlgoMate] Sending chat request to: ${endpoint}`);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: updatedMessages.slice(-6) // Include context of last 6 messages
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || `Server responded with status ${response.status}`);
      }

      setMessages(prev => [
        ...prev,
        {
          role: "bot",
          text: data.response || "⚠️ No response received from server.",
          source: data.source
        }
      ]);
    } catch (error) {
      console.error("[AlgoMate] Chat API Fetch Error:", error);
      const displayErr = error.message || "Failed to connect to AlgoMate backend server.";
      setErrorMessage(displayErr);
      setMessages(prev => [
        ...prev,
        {
          role: "bot",
          text: `⚠️ **Service Unavailable**: ${displayErr}\n\n*Please ensure the Flask backend server is running at ${targetBackendUrl}.*`
        }
      ]);
    } finally {
      // Guaranteed clearing of loading state under all conditions
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setMessages([
      {
        role: "bot",
        text: "👋 Hello! I am **AlgoMate AI**, your dedicated DSA & Programming assistant. Ask me any Data Structures or Algorithms question!"
      }
    ]);
    setErrorMessage(null);
  };

  const triggerFeatureAction = (actionType) => {
    let promptPrefix = "";
    if (actionType === "explain") {
      promptPrefix = "Explain this code in detail with step-by-step logic:\n";
    } else if (actionType === "dryrun") {
      promptPrefix = "Provide a dry run with sample input and trace table for:\n";
    } else if (actionType === "hint") {
      promptPrefix = "Give me a step-by-step hint without giving the complete solution for:\n";
    } else if (actionType === "similar") {
      promptPrefix = "List 3 similar practice problems with difficulty levels for:\n";
    }

    if (input.trim()) {
      handleSend(`${promptPrefix}${input}`);
    } else {
      setInput(promptPrefix);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gradient-to-br from-black via-gray-900 to-black text-gray-200">

      {/* Sidebar Navigation */}
      <div
        className={`fixed top-[64px] left-0 h-[calc(100vh-64px)] w-64 bg-gray-900 border-r border-gray-800 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-20 shadow-2xl`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" /> Controls
          </h2>
          <button onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6 text-gray-400 hover:text-white" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <button
            onClick={handleClearHistory}
            className="w-full flex items-center justify-center gap-2 bg-red-900/30 border border-red-700/50 hover:bg-red-900/50 text-red-300 py-2.5 px-4 rounded-xl text-sm font-medium transition"
          >
            <Trash2 className="w-4 h-4" /> Clear Session Chat
          </button>
          
          <div className="border-t border-gray-800 pt-4">
            <h3 className="text-xs uppercase font-semibold text-gray-500 mb-2">Quick Navigation</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="hover:text-cyan-400 cursor-pointer transition">📚 Notes & Topics</li>
              <li className="hover:text-cyan-400 cursor-pointer transition">📝 Interview Prep</li>
              <li className="hover:text-cyan-400 cursor-pointer transition">📊 Roadmap</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Chat Panel */}
      <div className="flex flex-col flex-1">

        {/* Header Bar */}
        <div className="flex items-center justify-between bg-black/40 backdrop-blur-md border-b border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6 text-cyan-400 hover:text-cyan-300" />
            </button>
            <h1 className="text-xl font-semibold text-cyan-400 flex items-center gap-2">
              AlgoMate AI Assistant
            </h1>
          </div>

          <button
            onClick={handleClearHistory}
            title="Clear Chat History"
            className="p-2 text-gray-400 hover:text-red-400 transition"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-5 py-4 rounded-2xl max-w-[85%] md:max-w-[75%] shadow-lg transition-all duration-300 ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium"
                    : "bg-gray-800/90 border border-gray-700/80 text-gray-200"
                }`}
              >
                {msg.source === "knowledge_base_ai" && (
                  <div className="text-xs font-semibold text-cyan-400 mb-2 flex items-center gap-1">
                    ⚡ Answer grounded in AlgoMate Knowledge Base
                  </div>
                )}
                {msg.source === "ai_model" && (
                  <div className="text-xs font-semibold text-purple-400 mb-2 flex items-center gap-1">
                    ✨ Generated by AlgoMate AI
                  </div>
                )}
                {msg.source === "error_fallback" && (
                  <div className="text-xs font-semibold text-yellow-400 mb-2 flex items-center gap-1">
                    ⚠️ AlgoMate AI Temporarily Unavailable
                  </div>
                )}
                <ReactMarkdown
                  components={{
                    h3({ children }) {
                      return <h3 className="text-cyan-400 font-bold text-lg mt-4 mb-2 border-b border-gray-700 pb-1">{children}</h3>;
                    },
                    p({ children }) {
                      return <p className="mb-2 leading-relaxed">{children}</p>;
                    },
                    li({ children }) {
                      return <li className="ml-4 list-disc mb-1 text-gray-300">{children}</li>;
                    },
                    code({ inline, children }) {
                      return !inline ? (
                        <pre className="bg-black/90 p-4 rounded-xl overflow-x-auto text-cyan-300 text-sm my-3 border border-gray-800">
                          <code>{children}</code>
                        </pre>
                      ) : (
                        <code className="bg-gray-700/60 px-1.5 py-0.5 rounded text-cyan-300 font-mono text-sm">
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-cyan-400 text-sm animate-pulse bg-gray-800/40 p-3 rounded-xl w-max border border-gray-700/50">
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
              AlgoMate AI is thinking and formulating response...
            </div>
          )}

          {errorMessage && (
            <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-xl text-red-300 text-sm flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <div>
                <strong>Connection Warning:</strong> {errorMessage}
              </div>
            </div>
          )}

          <div ref={bottomRef}></div>
        </div>

        {/* Feature Action Buttons */}
        <div className="px-6 pb-2 flex flex-wrap gap-2">
          <button
            onClick={() => triggerFeatureAction("explain")}
            className="flex items-center gap-1.5 bg-gray-800 border border-gray-700 hover:border-cyan-400 text-cyan-300 px-3 py-1.5 rounded-lg text-xs transition font-medium"
          >
            <Code className="w-3.5 h-3.5" /> Explain Code
          </button>
          <button
            onClick={() => triggerFeatureAction("dryrun")}
            className="flex items-center gap-1.5 bg-gray-800 border border-gray-700 hover:border-cyan-400 text-cyan-300 px-3 py-1.5 rounded-lg text-xs transition font-medium"
          >
            <Layers className="w-3.5 h-3.5" /> Dry Run
          </button>
          <button
            onClick={() => triggerFeatureAction("hint")}
            className="flex items-center gap-1.5 bg-gray-800 border border-gray-700 hover:border-cyan-400 text-cyan-300 px-3 py-1.5 rounded-lg text-xs transition font-medium"
          >
            <HelpCircle className="w-3.5 h-3.5" /> Get Hint
          </button>
          <button
            onClick={() => triggerFeatureAction("similar")}
            className="flex items-center gap-1.5 bg-gray-800 border border-gray-700 hover:border-cyan-400 text-cyan-300 px-3 py-1.5 rounded-lg text-xs transition font-medium"
          >
            <Sparkles className="w-3.5 h-3.5" /> Similar Problems
          </button>
        </div>

        {/* User Input Bar */}
        <div className="p-4 bg-black/60 backdrop-blur-md border-t border-gray-800 flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder="Ask AlgoMate anything about DSA or programming..."
            className="flex-1 bg-gray-800/80 text-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700/60 placeholder-gray-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="bg-cyan-400 text-black px-5 py-3 rounded-xl font-semibold hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Send
          </button>
        </div>
      </div>
    </div>
  );
}
