const ReviewForm = () => {
  return (
    <div className="backdrop-blur-[2px] bg-white/30 h-screen w-screen fixed ">
      <div className="bg-slate-200 p-3 w-60 rounded flex flex-col items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
        <div>ReviewForm</div>
        <div>評分</div>
        <input type="number" min={0} max={10} defaultValue={10} />
        <div>評價</div>
        <input type="text" defaultValue={'some text here.'} />
        <button className="m-2 p-2 bg-blue-200 cursor-pointer">送出評論</button>
      </div>
    </div>
  );
};

export default ReviewForm;
