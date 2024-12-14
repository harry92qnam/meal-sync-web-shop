import { create } from 'zustand';
interface GlobalNotiState {
  toggleChangingFlag: boolean;
  setToggleChangingFlag: (token: boolean) => void;
}

const useNotiState = create<GlobalNotiState>((set) => ({
  toggleChangingFlag: false,
  setToggleChangingFlag: (param: boolean) => set({ toggleChangingFlag: param }),
}));

export default useNotiState;
