const formatDate = (timestamp?: number) => {
    if (!timestamp) return
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('zh');
    return formattedDate;
};

export const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    let hours: string | number = date.getHours();
    let minutes: string | number = date.getMinutes();

    // 添加前导零以确保两位数小时和分钟
    hours = hours.toString().padStart(2, '0');
    minutes = minutes.toString().padStart(2, '0');

    return `${hours}:${minutes}`;
}

export default formatDate