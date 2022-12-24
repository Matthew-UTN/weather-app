export interface User {
    id:string, // identificarion in firestore
    email: string;
    createdAt: Date;
    disabled?:boolean; // if active, the user is disabled and should not be allowed to log in to the system.
    emailVerified?:boolean; // indicates that the email address has been validated with the use of a code sent to that address
    favorites?: string[];
}