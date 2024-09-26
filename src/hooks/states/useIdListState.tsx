import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';
interface IdListState {
  shopId: number;
  setShopId: (id: number) => void;
  accountId: number;
  setAccountId: (id: number) => void;
  productId: number;
  setProductId: (id: number) => void;
  orderId: number;
  setOrderId: (id: number) => void;
}

const useIdListState = create<IdListState>((set) => ({
  shopId: 0,
  setShopId: (id) => set((state) => ({ ...state, shopId: id })),
  accountId: 0,
  setAccountId: (id) => set((state) => ({ ...state, accountId: id })),
  productId: 0,
  setProductId: (id) => set((state) => ({ ...state, productId: id })),
  orderId: 0,
  setOrderId: (id) => set((state) => ({ ...state, orderId: id })),
}));

if (process.env.NODE_ENV === 'development') mountStoreDevtool('List Id State', useIdListState); // mount to devtool in dev mode

export default useIdListState;
