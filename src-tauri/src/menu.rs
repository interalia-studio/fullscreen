use tauri::{AboutMetadata, CustomMenuItem, Menu, MenuItem, Submenu, WindowMenuEvent};

pub fn handle_menu_event(event: WindowMenuEvent) {
    match event.menu_item_id() {
        "quit" => {
            std::process::exit(0);
        }
        _ => {}
    }
}

/**
 * Use `MenuBuilder` to setup the main application menu.
 *
 * Tauri has a method for creating OS-specific default menus but they can not be edited, therefore
 * all default menus are created manually here.
 * C.f. https://github.com/tauri-apps/tauri/issues/4945
 */
pub struct MenuBuilder(tauri::Menu);

impl MenuBuilder {
    pub fn new() -> Self {
        Self(Menu::new())
    }

    pub fn add_application_menu(mut self, application_name: &str) -> Self {
        let app_menu = Menu::new()
            .add_native_item(MenuItem::About(
                application_name.to_string(),
                AboutMetadata::default(),
            ))
            .add_native_item(MenuItem::Separator)
            .add_native_item(MenuItem::Services)
            .add_native_item(MenuItem::Separator)
            .add_native_item(MenuItem::Hide)
            .add_native_item(MenuItem::HideOthers)
            .add_native_item(MenuItem::ShowAll)
            .add_native_item(MenuItem::Separator)
            .add_native_item(MenuItem::Quit);
        self.0 = self.0.add_submenu(Submenu::new(application_name, app_menu));
        self
    }

    pub fn add_file_menu(mut self) -> Self {
        let file_menu = Menu::new()
            .add_item(
                CustomMenuItem::new("new".to_string(), "New")
                    .accelerator("CommandOrControl+N")
                    .into(),
            )
            .add_item(
                CustomMenuItem::new("open".to_string(), "Open...")
                    .accelerator("CommandOrControl+O")
                    .into(),
            )
            .add_item(
                CustomMenuItem::new("save".to_string(), "Save as...")
                    .accelerator("CommandOrControl+S")
                    .into(),
            )
            .add_item(
                CustomMenuItem::new("link".to_string(), "Share link...")
                    .accelerator("CommandOrControl+L")
                    .into(),
            )
            .add_native_item(MenuItem::Separator)
            .add_native_item(MenuItem::CloseWindow);
        self.0 = self.0.add_submenu(Submenu::new("File", file_menu));
        self
    }

    pub fn add_edit_menu(mut self) -> Self {
        let edit_menu = Menu::new()
            .add_native_item(MenuItem::Undo)
            .add_native_item(MenuItem::Redo)
            .add_native_item(MenuItem::Separator)
            .add_native_item(MenuItem::Cut)
            .add_native_item(MenuItem::Copy)
            .add_native_item(MenuItem::Paste)
            .add_native_item(MenuItem::SelectAll);

        self.0 = self.0.add_submenu(Submenu::new("Edit", edit_menu));
        self
    }

    pub fn add_window_menu(mut self) -> Self {
        let window_menu = Menu::new()
            .add_native_item(MenuItem::Minimize)
            .add_native_item(MenuItem::Zoom)
            .add_native_item(MenuItem::Separator)
            .add_native_item(MenuItem::CloseWindow);

        self.0 = self.0.add_submenu(Submenu::new("Window", window_menu));
        self
    }

    pub fn add_view_menu(mut self) -> Self {
        let view_menu = Menu::new().add_native_item(MenuItem::EnterFullScreen);

        self.0 = self.0.add_submenu(Submenu::new("View", view_menu));
        self
    }

    pub fn build(&self) -> Menu {
        self.0.clone()
    }
}
