import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api";
import { ThemeProvider } from "./components/theme-provider";
import { Sidebar } from "./components/Sidebar";
import { ChatArea } from "./components/ChatArea";
import { SettingsOverlay } from "./components/SettingsOverlay";
import "./App.css";

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [activeChats, setActiveChats] = useState<number>(1);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Start Ollama server
        await invoke("start_ollama");
        
        // Fetch available models
        const models = await invoke<string[]>("list_ollama_models");
        if (Array.isArray(models)) {
          setAvailableModels(models);
        }
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize');
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: '#fff' }}>
      <h1 style={{ marginBottom: '20px' }}>Ollama GUI</h1>
      
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <div style={{ display: 'flex', gap: '20px' }}>
          <Sidebar 
            onSettingsClick={() => setShowSettings(true)}
            onChatCountChange={setActiveChats}
            availableModels={availableModels}
          />
          
          <main style={{ flex: 1 }}>
            <div className={`chat-container split-${activeChats}`}>
              {Array.from({ length: activeChats }).map((_, idx) => (
                <ChatArea key={idx} chatId={idx} availableModels={availableModels} />
              ))}
            </div>
          </main>

          {showSettings && (
            <SettingsOverlay onClose={() => setShowSettings(false)} />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
