'use client';

const Page = ({ params }: { params: { userID: string } }) => {
  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';

  return (
    <div className="flex p-10 md:mx-auto md:max-w-3xl lg:max-w-5xl">
      <div className="w-2/6 bg-slate-300">left</div>
      <div className="w-4/6 bg-slate-200">right</div>
    </div>
  );
};

export default Page;
