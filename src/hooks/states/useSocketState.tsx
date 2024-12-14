import { Socket } from 'socket.io-client';
import { create } from 'zustand';
interface GlobalSocketState {
  socket: Socket | null;
  setSocket: (socket: Socket | null) => void;
}

const useSocketState = create<GlobalSocketState>((set) => ({
  socket: null,
  setSocket: (param: Socket | null) => set({ socket: param }),
}));

export default useSocketState;
