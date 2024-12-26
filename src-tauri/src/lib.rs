use std::process::Command;
use tauri::State;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
async fn start_ollama() -> Result<String, String> {
    Command::new("ollama")
        .arg("serve")
        .spawn()
        .map_err(|e| e.to_string())?;
    Ok("Ollama server started".to_string())
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, start_ollama])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
