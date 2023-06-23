'use client';

const FilterEvents = () => {
  return (
    <div className="bg-gray-400 p-2 flex">
      <div>排序方式</div>
      <button className="m-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">近期優先</button>
      <button className="m-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">評價排序</button>
    </div>
  );
};

export default FilterEvents;
