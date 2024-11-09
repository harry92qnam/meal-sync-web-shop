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

const dateToDateValue = (date: Date): CalendarDate => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return parseDate(`${year}-${month}-${day}`);
};

const DateRangeFilter = () => {
  // Calculate initial range values
  const { range, setRange, setDateFrom, setDateTo, selected, setSelected, isSpecificTimeFilter } =
    usePeriodTimeFilterState();
  const [choice, setChoice] = useState(selected.toString());

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
        label="Lọc theo thời gian"
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
