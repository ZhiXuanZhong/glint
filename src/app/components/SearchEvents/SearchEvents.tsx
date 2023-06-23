'use client';
const SearchEvents = ({ setEvents }: any) => {
  const handleSubmit = (e: any) => {
    e.preventDefault();

    const form = e.currentTarget;
    const { location, category, startTime, endTime, organizerType } = form.elements;
    const params = {
      location: String(location.value),
      category: String(category.value),
      startTime: String(Date.parse(startTime.value)),
      endTime: String(Date.parse(endTime.value)),
      organizerType: String(organizerType.value),
    };

    fetch('/api/get-events?' + new URLSearchParams(params))
      .then((res) => res.json())
      .then((json) => setEvents(json.data));
  };

  return (
    <div>
      <form action="/" method="get" name="query" onSubmit={handleSubmit}>
        <div className="bg-gray-300 p-2 flex">
          <div className="flex p-2">
            <h2>地點</h2>
            <select id="location">
              <option value="XL">小琉球</option>
              <option value="KT">墾丁</option>
              <option value="NEC">東北角</option>
              <option value="GI">綠島</option>
              <option value="PH">澎湖</option>
              <option value="LY">蘭嶼</option>
            </select>
          </div>

          <div className="flex bg-gray-300 p-2">
            <h2>類型</h2>
            <select name="category">
              <option value="divingTravel">潛旅</option>
              <option value="training">訓練</option>
              <option value="certificationTraining">證照課程</option>
              <option value="diverWanted">找潛伴</option>
              <option value="instructorWanted">找教練</option>
            </select>
          </div>

          <div className="flex bg-gray-300 p-2">
            <h2>出發區間：</h2>
            <input type="date" name="startTime" required />
          </div>

          <div className="flex bg-gray-300 p-2">
            <h2>至</h2>
            <input type="date" name="endTime" required />
          </div>

          <div className="flex bg-gray-300 p-2">
            <h2>發起人</h2>
            <select name="organizerType">
              <option value="instructor">教練</option>
              <option value="diver">一般潛水員</option>
            </select>
          </div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
            Search with Love♥️
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchEvents;
