import { Types } from "mongoose";


// dateing role
export enum Role {
    ADMIN = "ADMIN",
    USER = "USER"
}

// auth providers
export interface IAuthProvider {
    provider: "google" | "credentials";
    providerId: string
}


// user status
export enum Status {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}






export interface IUser {
    _id?: Types.ObjectId;
    displayName: string;
    fullName : string ;


    email: string;
    age?: number | null;
    image?: string;
    password?: string;
    bio?: string;

    availableForDate?: boolean; // user date ar jonno prepared kina ..
    availableForDance?: boolean; // dance ar jonno ?
    availableForFriend?: boolean;  // friend ar jonno

    newMatchesNotification?: boolean;  // jkhn 
    eventRemindersNotification?: boolean;  //when admin create an event ... this event notification send all user .jaden eventReminders true kora ase
    messageAlertsNotification?: boolean;  // jkhn message alert true kora ase tkhn ..every message a notification jabe

    isVerified?: boolean;

    lat?: number | null;
    long?: number | null;

    userLocation? : string | null;

    location?: {
        type: "Point";
        coordinates: [number, number]; // [long, lat]
    };

    interests?: Types.ObjectId[];

    status: Status;

    role: Role;
    auths?: IAuthProvider[];
    fcmToken? : string;



}
