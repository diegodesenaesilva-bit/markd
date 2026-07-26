import { create } from "zustand";

type SaveState = "idle" | "saving" | "error";
export type SettingsPage = "general" | "cloud" | "appearance" | "shortcuts";
export type NoteWidth = "focused" | "normal" | "expanded";
export type RightSidebarTab = "ask_mark" | "linked_mentions";

interface UiState {
  paletteOpen: boolean;
  settingsOpen: boolean;
  settingsPage: SettingsPage;
  sidebarHidden: boolean;
  backlinksHidden: boolean;
  markdownSource: boolean;
  saveState: SaveState;
  noteWidth: NoteWidth;
  rightSidebarOpen: boolean;
  rightSidebarTab: RightSidebarTab;
  setPaletteOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  openSettings: (page?: SettingsPage) => void;
  setSettingsPage: (page: SettingsPage) => void;
  toggleSidebar: () => void;
  toggleBacklinks: () => void;
  toggleMarkdownSource: () => void;
  setSaveState: (state: SaveState) => void;
  cycleNoteWidth: () => void;
  setRightSidebarOpen: (open: boolean) => void;
  setRightSidebarTab: (tab: RightSidebarTab) => void;
  openAskMark: () => void;
  openLinkedMentions: () => void;
  toggleRightSidebar: (tab?: RightSidebarTab) => void;
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
  rightSidebarOpen: false,
  rightSidebarTab: "ask_mark",
  setPaletteOpen: (paletteOpen) => set({ paletteOpen }),
  setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
  openSettings: (settingsPage = "general") =>
    set({ settingsOpen: true, settingsPage }),
  setSettingsPage: (settingsPage) => set({ settingsPage }),
  toggleSidebar: () => set({ sidebarHidden: !get().sidebarHidden }),
  toggleBacklinks: () => {
    const nextHidden = !get().backlinksHidden;
    set({
      backlinksHidden: nextHidden,
      rightSidebarOpen: !nextHidden,
      rightSidebarTab: "linked_mentions",
    });
  },
  toggleMarkdownSource: () =>
    set({ markdownSource: !get().markdownSource }),
  setSaveState: (saveState) => set({ saveState }),
  cycleNoteWidth: () => {
    const order: NoteWidth[] = ["focused", "normal", "expanded"];
    const current = get().noteWidth;
    const next = order[(order.indexOf(current) + 1) % order.length];
    set({ noteWidth: next });
  },
  setRightSidebarOpen: (rightSidebarOpen) => set({ rightSidebarOpen, backlinksHidden: !rightSidebarOpen }),
  setRightSidebarTab: (rightSidebarTab) => set({ rightSidebarTab }),
  openAskMark: () => set({ rightSidebarOpen: true, rightSidebarTab: "ask_mark", backlinksHidden: false }),
  openLinkedMentions: () => set({ rightSidebarOpen: true, rightSidebarTab: "linked_mentions", backlinksHidden: false }),
  toggleRightSidebar: (tab = "ask_mark") => {
    const isOpen = get().rightSidebarOpen;
    const currentTab = get().rightSidebarTab;
    if (isOpen && currentTab === tab) {
      set({ rightSidebarOpen: false, backlinksHidden: true });
    } else {
      set({ rightSidebarOpen: true, rightSidebarTab: tab, backlinksHidden: false });
    }
  },
}));
