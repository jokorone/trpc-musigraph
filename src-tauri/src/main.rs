#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![greet, login])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
fn greet(name: &str) -> String {
   format!("010101, {}!", name)
}

#[tauri::command]
fn login(uname: &str, pw: &str) -> Result<String, String> {
  // This will return an error
  std::fs::File::open("path/that/does/not/exist").map_err(|err| err.to_string())?;
  // Return nothing on success
  Ok(format!("Logged in:, {}! -- PW: {}", uname, pw).into())
}
