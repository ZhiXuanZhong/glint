'use client';

const ReviewButton = ({
  event,
  toggleReviewModal,
  hasReview,
}: {
  event: Event;
  toggleReviewModal: Function;
  hasReview: boolean | undefined;
}) => {
  return (
    <>
      {hasReview ? (
        <button className="m-1 rounded bg-gray-300 px-4 py-2 font-bold text-black " disabled>
          評價已送出
        </button>
      ) : (
        <button
          className="m-1 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
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
