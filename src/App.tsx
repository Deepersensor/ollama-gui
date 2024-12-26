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
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <div className="min-h-screen w-full bg-background text-foreground antialiased">
        <div className="flex h-screen">
          {isLoading ? (
            <div className="flex items-center justify-center w-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center w-full">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-destructive">Error</h2>
                <p className="text-muted-foreground">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <>
              <Sidebar 
                onSettingsClick={() => setShowSettings(true)}
                onChatCountChange={setActiveChats}
                availableModels={availableModels}
              />
              
              <main className="flex-1 overflow-hidden">
                <div className={`chat-container split-${activeChats}`}>
                  {Array.from({ length: activeChats }).map((_, idx) => (
                    <ChatArea key={idx} chatId={idx} availableModels={availableModels} />
                  ))}
                </div>
              </main>

              {showSettings && (
                <SettingsOverlay onClose={() => setShowSettings(false)} />
              )}
            </>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
