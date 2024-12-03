import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';
import PeriodTimeFilterQuery from '../../types/queries/PeriodTimeFilterQuery';

const getDateMinusDays = (date: Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() - days);
  return newDate;
};

const getThisYear = () => new Date().getFullYear();

export interface PeriodTimeFilterQueryState {
  selected: number;
  isSpecificTimeFilter: boolean;
  range: PeriodTimeFilterQuery;
  setRange: (value: PeriodTimeFilterQuery) => void;
  setDateFrom: (date: Date) => void;
  setDateTo: (date: Date) => void;
  setSelected: (index: number) => void;
}

const usePeriodTimeFilterState = create<PeriodTimeFilterQueryState>((set) => ({
  range: {
    dateFrom: new Date(0),
    dateTo: new Date(),
  } as PeriodTimeFilterQuery,
  selected: 3,
  isSpecificTimeFilter: false,
  setRange: (value) => set((state) => ({ ...state, range: value })),
  setDateFrom: (date) =>
    set((state) => ({
      ...state,
      range: { ...state.range, dateFrom: date },
    })),
  setDateTo: (date) =>
    set((state) => ({
      range: { ...state.range, dateTo: date },
    })),
  setSelected: (choice: number) => {
    {
      switch (choice) {
        case 1:
          set((state) => ({
            ...state,
            selected: choice,
            isSpecificTimeFilter: false,
            range: { dateFrom: new Date(0), dateTo: new Date() },
          }));
          break;
        case 2:
          set((state) => ({
            ...state,
            selected: choice,
            isSpecificTimeFilter: false,
            range: {
              dateFrom: getDateMinusDays(new Date(), 6),
              dateTo: new Date(),
            },
          }));
          break;
        case 3:
          set((state) => ({
            ...state,
            selected: choice,
            isSpecificTimeFilter: false,
            range: {
              dateFrom: getDateMinusDays(new Date(), 29),
              dateTo: new Date(),
            },
          }));
          break;
        case 4:
          set((state) => ({
            ...state,
            selected: choice,
            isSpecificTimeFilter: false,
            range: {
              dateFrom: new Date(getThisYear(), 0, 1),
              dateTo: new Date(),
            },
          }));

          break;
        case 5:
          set((state) => ({
            ...state,
            selected: choice,
            isSpecificTimeFilter: false,
            range: {
              dateFrom: new Date(getThisYear() - 1, 0, 1),
              dateTo: new Date(getThisYear() - 1, 11, 31),
            },
          }));
          break;
        default:
          set((state) => ({
            ...state,
            selected: choice,
            isSpecificTimeFilter: true,
          }));
      }
    }
  },
}));

if (process.env.NODE_ENV === 'development')
  mountStoreDevtool('PeriodTimeFilter State', usePeriodTimeFilterState); // mount to devtool in dev mode
export default usePeriodTimeFilterState;
