'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import db from '@/app/utils/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

interface InlineEdit {
  value: any;
  setValue: Function;
  field: string;
  fireCollection: string;
  userID: string;
  type: 'text' | 'textarea' | 'select';
}

const InlineEdit = ({ value, setValue, field, fireCollection, userID, type }: InlineEdit) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const updateFireData = async () => {
    switch (fireCollection) {
      case 'profiles':
        const updateProfileRef = doc(db, 'profiles', userID);
        setIsProcessing(true);
        console.log(field);
        await updateDoc(updateProfileRef, { [field]: value[field] });
        setTimeout(() => {
          setIsProcessing(false);
        }, 200);
        break;

      case 'users':
        const updatePersonalRef = doc(db, 'users', userID);
        setIsProcessing(true);
        console.log(field);
        await updateDoc(updatePersonalRef, { [field]: value[field] });
        setTimeout(() => {
          setIsProcessing(false);
        }, 200);
        break;

      default:
        break;
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue({ ...value, [field]: e.target.value });
  };

  // FIXME 把updateFireData做成傳入數值的function
  // updateFireData({ [field]: e.target.value });

  const onSelectChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue({ ...value, [field]: e.target.value });
    updateFireData();
  };

  const onKeyDown = (e: Event) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      e.target.blur();
    }
  };

  const onBlur = (e) => {
    updateFireData();
  };

  useEffect(() => {
    // 這邊會造每改一次都會再存一次
    // 但不這樣用select會沒有作用
    // 是因為還沒set進去state就取值，谷哥建議用args送去更新
    updateFireData();
  }, [value[field]]);

  return (
    <>
      {type === 'text' && <input type="text" value={value[field] ? value[field] : null} onChange={onChange} onKeyDown={onKeyDown} onBlur={onBlur} className="font-bold text-moonlight-950" />}
      {type === 'textarea' && (
        <textarea rows={8} cols={100} type="text" value={value[field] ? value[field] : null} onChange={onChange} onKeyDown={onKeyDown} onBlur={onBlur} className="font-bold text-moonlight-950" />
      )}
      {type === 'select' && (
        <select value={value[field] ? value[field] : null} onChange={onSelectChange} className=" font-bold">
          <option value="SSI Basic / Pool">SSI Basic / Pool</option>
          <option value="SSI Level 1">SSI Level 1</option>
          <option value="SSI Level 2">SSI Level 2</option>
          <option value="SSI Level 3">SSI Level 3</option>
          <option value="SSI Instructor">SSI Instructor</option>
          <option value="AIDA 1">AIDA 1</option>
          <option value="AIDA 2">AIDA 2</option>
          <option value="AIDA 3">AIDA 3</option>
          <option value="AIDA 4">AIDA 4</option>
          <option value="AIDA Instructor">AIDA Instructor</option>
          <option value="PADI Basic Freediver">PADI Basic Freediver</option>
          <option value="PADI Freediver">PADI Freediver</option>
          <option value="PADI Advanced Freediver">PADI Advanced Freediver</option>
          <option value="PADI Master Freediver">PADI Master Freediver</option>
          <option value="PADI Instructor">PADI Instructor</option>
        </select>
      )}
      {isProcessing && <span>儲存中...</span>}
    </>
  );
};

export default InlineEdit;
