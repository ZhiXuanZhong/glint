'use client';
// 當前評論event傳到這邊，再傳回去page，drilling偏深
const ReviewButton = ({ event, toggleReviewModal, hasReview }: { event: Event; toggleReviewModal: Function; hasReview: boolean | undefined }) => {
  return (
    <>
      {hasReview ? (
        <button className="bg-gray-300 text-black font-bold py-2 px-4 m-1 rounded " disabled>
          評價已送出
        </button>
      ) : (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-1 rounded"
          onClick={() => {
            toggleReviewModal(event);
            console.log(event);
          }}
        >
          留下評價
        </button>
      )}
    </>
  );
};

export default ReviewButton;
