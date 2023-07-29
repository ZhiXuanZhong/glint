const formatDate = (timestamp?: number) => {
    if (!timestamp) return
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('zh');
    return formattedDate;
};

export const timeToHyphenYMD = (timestamp: number): string => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    let hours: string | number = date.getHours();
    let minutes: string | number = date.getMinutes();

    hours = hours.toString().padStart(2, '0');
    minutes = minutes.toString().padStart(2, '0');

    return `${hours}:${minutes}`;
}

export default formatDate