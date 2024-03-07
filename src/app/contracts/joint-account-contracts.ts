export interface UserDetails<T, U> {
    user: {
        firstName: T,
        lastName: T,
        email: T,
        mobileNumber: T,
        dateOfBirth: T,
        userInputWeightInKG: T,
        heightMeters: T,
        gender: T,
        aadhaarNumber: T,
        fingerprint: T,
        affiliate: T,
        terms: U,
        privacyAgreed: U,
        care_taker_details_list?: {
            [key: string]: CareTakerDetail
        }
    },
    password: T,
    encryptionVersion: null
};

export interface CareTakerDetail {
    is_joint_account: boolean,
    caretaker_ihl_id: string,
    vital_read: boolean,
    vital_write: boolean,
    teleconsult_read: boolean,
    teleconsult_write: boolean
}

export interface MainAccountDetails {
    email: string,
    mobileNumber: string,
    userInputWeightInKG: string,
    firstName: string,
    lastName: string,
    aadhaarNumber: string,
    dateOfBirth: string,
    gender: string,
    heightMeters: string,
    fingerprint: string,
    terms: Object,
    privacyAgreed: Object,
    joint_user_detail_list: Object
}

export interface SeperateJointAccountRequestDetails {
    care_taker_ihl_id: string,
    care_taker_name: string,
    care_taker_email: string,
    user_ihl_id: string,
    user_email: string,
    user_name: string,
    user_mobile_no: string,
}

export interface MainUserAccountCredentials {
    email: string;
    mobileNumber: string;
    id: number | string;
    Token: number | string;
    password: any;
}

export let colorPalettes: Array<string> = [
    "#c2185b",
    "#7b1fa2",
    "#512da8",
    "#fd7e15",
    "#6f42c1bd",
    "#f782ac",
    "#65bc87",
    "#f53f00",
    "#be4bdc",
    "#704DFF",
    "#FF9912",
    "#DC143C",
    "#7468BE",
    "#d46bd2",
    "#6abf64",
    "#df8b05",
    "#8B8B00"
]