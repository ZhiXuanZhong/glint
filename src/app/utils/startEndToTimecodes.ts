const startEndToTimecodes = ([startDate, endDate]: [Date | null, Date | null]): number[] => {
  const start = startDate ? new Date(startDate) : new Date();
  start.setHours(0, 0, 0);
  const end = endDate ? new Date(endDate) : new Date();
  end.setHours(23, 59, 59);

  return [start.getTime(), end.getTime()];
};

export default startEndToTimecodes;
