'use client';
import { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const StaticCalendar = ({ start, end }: { start: Date; end: Date }) => {
  const [startDate, setStartDate] = useState(start);
  const [endDate, setEndDate] = useState(end);

  return (
    <div>
      <ReactDatePicker startDate={startDate} endDate={endDate} selectsRange inline disabledKeyboardNavigation onChange={() => {}} wrapperClassName="datePicker" dateFormat="dd/MM/yyyy" />
    </div>
  );
};

export default StaticCalendar;
