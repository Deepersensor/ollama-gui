import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";

interface SidebarProps {
  onSettingsClick: () => void;
  onChatCountChange: (count: number) => void;
  availableModels: string[];
}

export function Sidebar({ onSettingsClick, onChatCountChange, availableModels }: SidebarProps) {
  return (
    <div className="w-64 border-r bg-background p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Ollama GUI</h2>
        <ThemeToggle />
      </div>
      
      <div className="space-y-2">
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={() => onChatCountChange(1)}
        >
          Single Chat
        </Button>
        <Button 
          variant="outline"
          className="w-full justify-start"
          onClick={() => onChatCountChange(2)}
        >
          Split View (2)
        </Button>
        <Button 
          variant="outline"
          className="w-full justify-start"
          onClick={() => onChatCountChange(3)}
        >
          Split View (3)
        </Button>
      </div>

      <div className="flex-1">
        <h3 className="mb-2 text-sm font-semibold">Available Models</h3>
        <div className="space-y-1">
          {availableModels.map((model) => (
            <div key={model} className="px-2 py-1 text-sm hover:bg-accent rounded-md cursor-pointer">
              {model}
            </div>
          ))}
        </div>
      </div>

      <Button onClick={onSettingsClick}>
        Settings
      </Button>
    </div>
  );
}
