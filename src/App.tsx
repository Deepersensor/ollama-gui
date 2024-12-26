import { useState } from "react";
import { ThemeProvider } from "./components/theme-provider";
import { Sidebar } from "./components/Sidebar";
import { ChatArea } from "./components/ChatArea";
import { SettingsOverlay } from "./components/SettingsOverlay";
import "./App.css";

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [activeChats, setActiveChats] = useState<number>(1);
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <div className="app-container">
        <Sidebar 
          onSettingsClick={() => setShowSettings(true)}
          onChatCountChange={setActiveChats}
          availableModels={availableModels}
        />
        
        <main className={`chat-container split-${activeChats}`}>
          {Array.from({ length: activeChats }).map((_, idx) => (
            <ChatArea key={idx} chatId={idx} />
          ))}
        </main>

        {showSettings && (
          <SettingsOverlay onClose={() => setShowSettings(false)} />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
