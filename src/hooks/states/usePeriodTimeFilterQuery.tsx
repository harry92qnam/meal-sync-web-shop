import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';
import PeriodTimeFilterQuery from '../../types/queries/PeriodTimeFilterQuery';

const adjustToTimezone = (date: Date, timezoneOffset: number): Date => {
  const adjustedDate = new Date(date.getTime() + timezoneOffset);
  return adjustedDate;
};

const timezoneOffset = 7 * 60 * 60 * 1000;

const getDateMinusDays = (date: Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() - days);
  return adjustToTimezone(newDate, timezoneOffset);
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
    dateFrom: adjustToTimezone(new Date(getThisYear(), 0, 1), timezoneOffset),
    dateTo: adjustToTimezone(new Date(), timezoneOffset),
  } as PeriodTimeFilterQuery,
  selected: 3,
  isSpecificTimeFilter: false,
  setRange: (value) => set((state) => ({ ...state, range: value })),
  setDateFrom: (date) =>
    set((state) => ({
      ...state,
      range: { ...state.range, dateFrom: adjustToTimezone(date, timezoneOffset) },
    })),
  setDateTo: (date) =>
    set((state) => ({
      range: { ...state.range, dateTo: adjustToTimezone(date, timezoneOffset) },
    })),
  setSelected: (choice: number) => {
    {
      switch (choice) {
        case 1:
          set((state) => ({
            ...state,
            selected: choice,
            isSpecificTimeFilter: false,
            range: {
              dateFrom: adjustToTimezone(new Date(getThisYear(), 0, 1), timezoneOffset),
              dateTo: adjustToTimezone(new Date(), timezoneOffset),
            },
          }));
          break;
        case 2:
          set((state) => ({
            ...state,
            selected: choice,
            isSpecificTimeFilter: false,
            range: {
              dateFrom: adjustToTimezone(getDateMinusDays(new Date(), 6), timezoneOffset),
              dateTo: adjustToTimezone(new Date(), timezoneOffset),
            },
          }));
          break;
        case 3:
          set((state) => ({
            ...state,
            selected: choice,
            isSpecificTimeFilter: false,
            range: {
              dateFrom: adjustToTimezone(getDateMinusDays(new Date(), 29), timezoneOffset),
              dateTo: adjustToTimezone(new Date(), timezoneOffset),
            },
          }));
          break;
        case 4:
          set((state) => ({
            ...state,
            selected: choice,
            isSpecificTimeFilter: false,
            range: {
              dateFrom: adjustToTimezone(new Date(getThisYear(), 0, 1), timezoneOffset),
              dateTo: adjustToTimezone(new Date(), timezoneOffset),
            },
          }));
          break;
        case 5:
          set((state) => ({
            ...state,
            selected: choice,
            isSpecificTimeFilter: false,
            range: {
              dateFrom: adjustToTimezone(new Date(getThisYear() - 1, 0, 1), timezoneOffset),
              dateTo: adjustToTimezone(new Date(getThisYear() - 1, 11, 31), timezoneOffset),
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
