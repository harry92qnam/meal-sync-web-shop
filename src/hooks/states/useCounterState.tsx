import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';
interface EmailState {
  email: string;
  setEmail: (email: string) => void;
  otp: string;
  setOtp: (otp: string) => void;
}

const useEmailState = create<EmailState>((set) => ({
  email: '',
  setEmail: (email) => set({ email }),
  otp: '',
  setOtp: (otp) => set({ otp }),
}));

if (process.env.NODE_ENV === 'development') mountStoreDevtool('Counter State', useEmailState);

export default useEmailState;
