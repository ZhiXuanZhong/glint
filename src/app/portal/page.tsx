'use client';

import { Tab, Tabs } from '@/components/Tabs/Tabs';

const Page = () => {
  return (
    <div className="pt-10">
      <Tabs>
        <Tab label="參與的活動">
          <div className="flex flex-col gap-4 py-4">
            <div>
              <h2 className="mb-2 text-lg font-medium">即將展開</h2>
              <p className="text-gray-700">這邊放未來活動</p>
            </div>
            <div>
              <h2 className="mb-2 text-lg font-medium">已結束</h2>
              <p className="text-gray-700">這邊放要評價的活動</p>
            </div>
          </div>
        </Tab>
        <Tab label="蒐藏清單">
          <div className="flex flex-col gap-4 py-4">
            <h2 className="mb-2 text-lg font-medium">已蒐藏的活動</h2>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Page;
