import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

interface RefetchState {
  isRefetch: boolean;
  setIsRefetch: () => void; // New method for toggling
}

const useRefetch = create<RefetchState>((set) => ({
  isRefetch: false,
  setIsRefetch: () => set((state) => ({ isRefetch: !state.isRefetch })), // Toggle the value
}));

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('Refetch State', useRefetch); // mount to devtool in dev mode
}

export default useRefetch;
