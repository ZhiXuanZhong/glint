'use client';

const SortEvents = ({ handleSort }: any) => {
  return (
    <div className="bg-gray-400 p-2 flex">
      <div>排序方式</div>
      <button
        className="m-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          handleSort('latest');
        }}
      >
        最新
      </button>
      <button
        className="m-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          handleSort('nerest');
        }}
      >
        近期優先
      </button>
      <button
        className="m-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          handleSort('rating');
        }}
      >
        評價優先
      </button>
    </div>
  );
};

export default SortEvents;
