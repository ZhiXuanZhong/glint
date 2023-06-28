declare interface QueryParams {
    locations: string | null;
    category: string | null;
    startTime: number;
    endTime: number;
    organizerType: string | null;
    [index: string]: string | number | null;
}

declare interface QueryConditions {
    property: string;
    operator: '==' | '>=' | '<=' | 'array-contains';
    value: string | number | null;
}

declare interface Event {
    rating: number;
    title: string;
    organizer: string;
    levelSuggection: string;
    status: string;
    description: string;
    createdTime: {
        seconds: number;
        nanoseconds: number;
    };
    endTime: number;
    mainImage: string;
    locations: string[];
    startTime: number;
    organizerType: string;
    organizerLevel: string;
    category: string;
    id: string;
}

declare interface UsersProfile {
    type: string;
    createdAt: { seconds: number; nanoseconds: number };
    avatarURL: string;
    firstDive: number;
    location: string;
    hasLicence: boolean;
    username: string;
    bio: string;
    level: string;
    id?: string; // Added optional id field
}

declare interface Applicants {
    level: string;
    name: string;
    applyTime: number[];
    id: string;
}

declare interface Participants {
    level: string;
    name: string;
    id: string;
    approvedTime?: number[]; // Added optional approvedTime field
}

declare interface PortalEvent {
    hasReview: boolean;
    isFavorite: boolean;
    status: string;
    type: string;
    id: string;
    data: Event;
}

declare interface PortalEventType {
    hosted: 'hosted';
    joined: 'joined';
    pending: 'pending';
    rejected: 'rejected';
    canceled: 'canceled';
    favorite: 'favorite';
    withdrawn: 'withdrawn';
}

declare interface Profiles {
    [key: string]: UsersProfile;
}

declare interface RegList {
    applicants: Applicants[];
    participants: Participants[];
}

declare interface Info {
    imageURL: string;
    name: string;
    level: string;
    licence: boolean;
}

declare interface EventCardProps {
    event: Event;
    portal?: boolean;
    edit?: boolean;
    cancel?: boolean;
    withdraw?: boolean
    apply?: boolean;
    review?: boolean;
    updateWithdraw?: function
    toggleReviewModal?: function
    hasReview?: boolean
}

interface UserRating {
    ratingSum: number;
    reviewCount: number;
}