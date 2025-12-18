use gpui::{App, Entity, Menu, MenuItem, SharedString};
use gpui_component::menu::AppMenuBar;
use gpui_component::{ActiveTheme as _, Theme, ThemeMode, ThemeRegistry};

use crate::actions::{About, Open, Quit};
use crate::themes::{SwitchTheme, SwitchThemeMode};

pub fn init(title: impl Into<SharedString>, cx: &mut App) -> Entity<AppMenuBar> {
    let app_menu_bar = AppMenuBar::new(cx);
    let title: SharedString = title.into();

    update_app_menu(title.clone(), app_menu_bar.clone(), cx);

    // Observe theme changes to update the menu to refresh the checked state
    cx.observe_global::<Theme>({
        let title = title.clone();
        let app_menu_bar = app_menu_bar.clone();

        move |cx| {
            update_app_menu(title.clone(), app_menu_bar.clone(), cx);
        }
    })
    .detach();

    app_menu_bar
}

fn update_app_menu(title: impl Into<SharedString>, app_menu_bar: Entity<AppMenuBar>, cx: &mut App) {
    let mode = cx.theme().mode;

    cx.set_menus(vec![
        Menu {
            name: title.into(),
            items: vec![
                MenuItem::action("About", About),
                MenuItem::Separator,
                MenuItem::action("Open...", Open),
                MenuItem::Separator,
                MenuItem::Submenu(Menu {
                    name: "Appearance".into(),
                    items: vec![
                        MenuItem::action("Light", SwitchThemeMode(ThemeMode::Light))
                            .checked(!mode.is_dark()),
                        MenuItem::action("Dark", SwitchThemeMode(ThemeMode::Dark))
                            .checked(mode.is_dark()),
                    ],
                }),
                theme_menu(cx),
                MenuItem::Separator,
                MenuItem::action("Quit", Quit),
            ],
        },
        Menu {
            name: "Edit".into(),
            items: vec![
                MenuItem::action("Undo", gpui_component::input::Undo),
                MenuItem::action("Redo", gpui_component::input::Redo),
                MenuItem::separator(),
                MenuItem::action("Cut", gpui_component::input::Cut),
                MenuItem::action("Copy", gpui_component::input::Copy),
                MenuItem::action("Paste", gpui_component::input::Paste),
                MenuItem::separator(),
                MenuItem::action("Delete", gpui_component::input::Delete),
                MenuItem::action(
                    "Delete Previous Word",
                    gpui_component::input::DeleteToPreviousWordStart,
                ),
                MenuItem::action(
                    "Delete Next Word",
                    gpui_component::input::DeleteToNextWordEnd,
                ),
                MenuItem::separator(),
                MenuItem::action("Find", gpui_component::input::Search),
                MenuItem::separator(),
                MenuItem::action("Select All", gpui_component::input::SelectAll),
            ],
        },
        Menu {
            name: "Help".into(),
            items: vec![MenuItem::action("Open Website", Open)],
        },
    ]);

    app_menu_bar.update(cx, |menu_bar, cx| {
        menu_bar.reload(cx);
    })
}

fn theme_menu(cx: &App) -> MenuItem {
    let themes = ThemeRegistry::global(cx).sorted_themes();
    let current_name = cx.theme().theme_name();

    MenuItem::Submenu(Menu {
        name: "Theme".into(),
        items: themes
            .iter()
            .map(|theme| {
                let checked = current_name == &theme.name;
                MenuItem::action(theme.name.clone(), SwitchTheme(theme.name.clone()))
                    .checked(checked)
            })
            .collect(),
    })
}
