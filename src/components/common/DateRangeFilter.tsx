'use client';
import Selector from '@/components/common/Selector';
import usePeriodTimeFilterState from '@/hooks/states/usePeriodTimeFilterQuery';
import { parseDate } from '@internationalized/date';
import { CalendarDate, DateValue, RangeValue } from '@nextui-org/react';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const DateRangePicker = dynamic(
  () => import('@nextui-org/react').then((mod) => mod.DateRangePicker),
  {
    ssr: false,
  },
);

export const dateToDateValue = (date: Date): CalendarDate => {
  const year = date.getUTCFullYear(); // Use UTC methods
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // UTC month
  const day = String(date.getUTCDate()).padStart(2, '0'); // UTC day
  return parseDate(`${year}-${month}-${day}`);
};

const DateRangeFilter = () => {
  // Calculate initial range values
  const { range, setDateFrom, setDateTo, setSelected, isSpecificTimeFilter } =
    usePeriodTimeFilterState();
  const [choice, setChoice] = useState<string>('1');

  //event handling
  const onChangeDashboardTimeFilterQuery = (key: number) => {
    setSelected(key);
  };

  const onDateRangePickerChange = (range: RangeValue<DateValue>) => {
    if (range.start) {
      setDateFrom(new Date(range.start.toString()));
    }
    if (range.end) {
      setDateTo(new Date(range.end.toString()));
    }
  };

  return (
    <div className="grid grid-cols-2 gap-1">
      <Selector
        width="180px"
        label="Lọc theo khoảng thời gian"
        placeholder="Chọn khoảng thời gian"
        onSelect={(id) => {
          setChoice(id.toString());
          onChangeDashboardTimeFilterQuery(parseInt(id.toString()));
        }}
        selected={choice}
        options={[
          { key: 1, label: 'Tất cả' },
          { key: 2, label: '7 ngày gần nhất' },
          { key: 3, label: '30 ngày gần nhất' },
          { key: 4, label: 'Trong năm này' },
          { key: 5, label: 'Trong năm trước' },
          { key: 6, label: 'Tự chọn' },
        ]}
      />
      <DateRangePicker
        label="Chọn ngày"
        variant="bordered"
        isDisabled={!isSpecificTimeFilter}
        defaultValue={{
          start: dateToDateValue(range.dateFrom),
          end: dateToDateValue(range.dateTo),
        }}
        value={{
          start: dateToDateValue(range.dateFrom),
          end: dateToDateValue(range.dateTo),
        }}
        onChange={onDateRangePickerChange}
        className="max-w-xs"
      />
    </div>
  );
};

export default DateRangeFilter;
