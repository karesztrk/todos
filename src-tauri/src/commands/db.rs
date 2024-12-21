#[tauri::command]
pub async fn save() -> Result<(), String> {
    Ok(())
}

#[tauri::command]
pub async fn load() -> Result<(), String> {
    Ok(())
}
