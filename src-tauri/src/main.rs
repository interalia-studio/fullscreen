#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{CustomMenuItem, Menu, Submenu, WindowMenuEvent};

fn create_application_menu() -> Menu {
    Menu::new().add_submenu(Submenu::new(
        "File",
        Menu::with_items([
            CustomMenuItem::new("open".to_string(), "Open...").into(),
            CustomMenuItem::new("save".to_string(), "Save as...").into(),
            CustomMenuItem::new("quit".to_string(), "Quit").into(),
        ]),
    ))
}

fn handle_menu_event(event: WindowMenuEvent) {
    match event.menu_item_id() {
        "quit" => {
            std::process::exit(0);
        }
        _ => {}
    }
}

fn main() {
    tauri::Builder::default()
        .menu(create_application_menu())
        .on_menu_event(handle_menu_event)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
