import { create } from 'zustand';

interface AppState {
  currentRoom: 'outside' | 'lobby' | 'room2' | 'room3' | 'room4';
  setRoom: (room: AppState['currentRoom']) => void;
  subtitle: string | null;
  setSubtitle: (subtitle: string | null) => void;
  activeAudio: HTMLAudioElement | null;
  setActiveAudio: (audio: HTMLAudioElement | null) => void;
}

export const useStore = create<AppState>((set) => ({
  currentRoom: 'outside',
  setRoom: (room) => set({ currentRoom: room }),
  subtitle: null,
  setSubtitle: (subtitle) => set({ subtitle }),
  activeAudio: null,
  setActiveAudio: (activeAudio) => set({ activeAudio }),
}));

