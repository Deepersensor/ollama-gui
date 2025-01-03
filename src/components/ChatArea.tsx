import { useState } from 'react';
import { invoke } from "@tauri-apps/api";

interface ChatAreaProps {
  chatId: number;
  availableModels: string[];
}

export function ChatArea({ chatId, availableModels }: ChatAreaProps) {
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState(availableModels[0] || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');

    // Generate response
    const response = await invoke<string>("generate_response", { model: selectedModel, prompt: input });
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
  };

  return (
    <div className="flex flex-col h-full border rounded-lg p-4 bg-background shadow-sm">
      <div className="flex-1 overflow-auto space-y-4 mb-4 px-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[70%] p-3 rounded-lg ${
              msg.role === 'user' ? 'bg-primary/10 self-end' : 'bg-muted'
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <select 
          value={selectedModel} 
          onChange={(e) => setSelectedModel(e.target.value)}
          className="p-2 border rounded"
        >
          {availableModels.map(model => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90"
        >
          Send
        </button>
      </form>
    </div>
  );
}
