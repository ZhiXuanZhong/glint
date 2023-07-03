// 將dateRange轉換成timecode，開頭00:00結束23:59
const startEndToTimecodes = ([starDate, endDate]: Date[]) => {
    const start = new Date(starDate);
    start.setHours(0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59);

    return [start.getTime(), end.getTime()];
};

export default startEndToTimecodes