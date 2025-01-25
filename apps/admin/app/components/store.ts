import {create} from "zustand";

interface AuthState {
    accessToken: string | null;
    setAccessToken: (token: string) => void;
    logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    setAccessToken: (token: string) => set({ accessToken: token }),
    logout: () => set({ accessToken: null }),
}));

export default useAuthStore;
