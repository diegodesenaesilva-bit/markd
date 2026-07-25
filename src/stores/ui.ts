import { create } from "zustand";

type SaveState = "idle" | "saving" | "error";
export type SettingsPage = "general" | "cloud" | "appearance" | "shortcuts";
export type NoteWidth = "focused" | "normal" | "expanded";

interface UiState {
  paletteOpen: boolean;
  settingsOpen: boolean;
  settingsPage: SettingsPage;
  sidebarHidden: boolean;
  backlinksHidden: boolean;
  markdownSource: boolean;
  saveState: SaveState;
  noteWidth: NoteWidth;
  setPaletteOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  openSettings: (page?: SettingsPage) => void;
  setSettingsPage: (page: SettingsPage) => void;
  toggleSidebar: () => void;
  toggleBacklinks: () => void;
  toggleMarkdownSource: () => void;
  setSaveState: (state: SaveState) => void;
  cycleNoteWidth: () => void;
}

export const useUi = create<UiState>((set, get) => ({
  paletteOpen: false,
  settingsOpen: false,
  settingsPage: "general",
  sidebarHidden: false,
  backlinksHidden: true,
  markdownSource: false,
  saveState: "idle",
  noteWidth: "normal",
  setPaletteOpen: (paletteOpen) => set({ paletteOpen }),
  setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
  openSettings: (settingsPage = "general") =>
    set({ settingsOpen: true, settingsPage }),
  setSettingsPage: (settingsPage) => set({ settingsPage }),
  toggleSidebar: () => set({ sidebarHidden: !get().sidebarHidden }),
  toggleBacklinks: () => set({ backlinksHidden: !get().backlinksHidden }),
  toggleMarkdownSource: () =>
    set({ markdownSource: !get().markdownSource }),
  setSaveState: (saveState) => set({ saveState }),
  cycleNoteWidth: () => {
    const order: NoteWidth[] = ["focused", "normal", "expanded"];
    const current = get().noteWidth;
    const next = order[(order.indexOf(current) + 1) % order.length];
    set({ noteWidth: next });
  },
}));
