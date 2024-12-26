interface SettingsOverlayProps {
  onClose: () => void;
}

export function SettingsOverlay({ onClose }: SettingsOverlayProps) {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", 
                  background: "rgba(0,0,0,0.2)", display: "flex", alignItems: "center", 
                  justifyContent: "center" }}>
      <div style={{ background: "#fff", padding: "20px", borderRadius: "8px" }}>
        <p>Settings</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}