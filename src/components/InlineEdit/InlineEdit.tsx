'use client';

import { ChangeEvent } from 'react';

const InlineEdit = ({ value, setValue, field }: { value: any; setValue: Function; field: string }) => {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue((draft) => {
      draft[field] = e.target.value;
    });
  };

  const onKeyDown = (e: Event) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      e.target.blur();
    }
  };

  const onBlur = (e) => {
    setValue(e.target.value);
    console.log(value[field]);
  };

  return <input type="text" value={value[field] ? value[field] : null} onChange={onChange} onKeyDown={onKeyDown} onBlur={onBlur} />;
};

export default InlineEdit;
