export const convertLocationCode = (code: string): string => {
    const translations: { [key: string]: string } = {
        "KT": "墾丁",
        "NEC": "東北角",
        "XL": "小琉球",
        "GI": "綠島",
        "PH": "澎湖",
        "LY": "蘭嶼"
    };

    if (code in translations) {
        return translations[code];
    } else {
        return code;
    }
}
