export class FireStore {
    id?: any;
    title?: string;
    description?: string;
    published?: boolean;
    sender_id?:string|number;
    sender_session_id?:number;
    receiver_ids?:(string|number)[]; 
    data?:{};
}