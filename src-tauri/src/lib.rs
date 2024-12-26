use std::process::Command;
use tauri::command;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[command]
async fn start_ollama() -> Result<String, String> {
    Command::new("ollama")
        .arg("serve")
        .spawn()
        .map_err(|e| e.to_string())?;
    Ok("Ollama server started".to_string())
}

#[command]
async fn list_ollama_models() -> Result<Vec<String>, String> {
    let output = Command::new("ollama")
        .arg("list")
        .output()
        .map_err(|e| format!("Failed to start ollama list command: {}", e))?;
    if !output.status.success() {
        return Err(format!(
            "ollama list command failed: {}",
            String::from_utf8_lossy(&output.stderr)
        ));
    }
    let stdout = String::from_utf8_lossy(&output.stdout);
    let models: Vec<String> = stdout
        .lines()
        .map(|line| line.trim().to_string())
        .filter(|line| !line.is_empty())
        .collect();
    Ok(models)
}

#[command]
async fn generate_response(model: &str, prompt: &str) -> Result<String, String> {
    let client = reqwest::Client::new();
    let res = client.post("http://localhost:11434/api/generate")
        .json(&serde_json::json!({
            "model": model,
            "prompt": prompt,
            "stream": false
        }))
        .send()
        .await
        .map_err(|e| e.to_string())?;
    
    if res.status().is_success() {
        let json: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
        Ok(json["response"].as_str().unwrap_or_default().to_string())
    } else {
        Err(format!("Error: {}", res.status()))
    }
}

#[command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, start_ollama, list_ollama_models, generate_response])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
