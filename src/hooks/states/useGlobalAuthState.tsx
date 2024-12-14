import AuthDTO from '@/types/dtos/AuthDTO';
import { create } from 'zustand';
interface GlobalAuthState {
  token: string;
  roleId: number;
  setToken: (token: string) => void;
  setRoleId: (roleId: number) => void;
  authDTO: AuthDTO | null;
  setAuthDTO: (authDTO: AuthDTO | null) => void;
  clear: () => void;
}

const useGlobalAuthState = create<GlobalAuthState>((set) => ({
  token: '',
  roleId: 0,
  authDTO: null,
  setToken: (token: string) => set({ token: token }),
  setRoleId: (roleId: number) => set({ roleId: roleId }),
  setAuthDTO: (authDTO: AuthDTO | null) => set({ authDTO: authDTO }),
  clear: () => set({ token: '', roleId: 0, authDTO: null }),
}));

export default useGlobalAuthState;
