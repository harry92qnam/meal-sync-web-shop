import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';
interface CounterState {
  counter: number;
  max: number;
  increment: () => void;
  reset: () => void;
}

const useCounterState = create<CounterState>((set) => ({
  counter: 0,
  max: 5,
  increment: () => set((state) => ({ counter: state.counter + 1 })),
  reset: () => set(() => ({ counter: 0 })),
}));

if (process.env.NODE_ENV === 'development') mountStoreDevtool('Counter State', useCounterState); // mount to devtool in dev mode

export default useCounterState;
