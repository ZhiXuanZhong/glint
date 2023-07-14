'use client';

import { GoogleLogin, EmailLogin } from '@/components/Login/Login';

const page = () => {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center">
        <EmailLogin />
        <hr className="my-6  max-w-sm mx-auto" />
        <GoogleLogin />
      </div>
    </div>
  );
};

export default page;
