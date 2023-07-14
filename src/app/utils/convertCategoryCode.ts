export const convertCategoryCode = (code: string): string => {
    const translations: { [key: string]: string } = {
        "training": "訓練",
        "divingTravel": "潛旅",
        "certificationTraining": "證照課程",
        "diverWanted": "找潛伴",
        "instructorWanted": "找教練"
    };

    if (code in translations) {
        return translations[code];
    } else {
        return code;
    }
};
