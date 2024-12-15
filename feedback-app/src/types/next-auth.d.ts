import 'next-auth'
import { DefaultSession } from 'next-auth';

 // now i can redefine/modify standered next auth types , like i can change user of next auth to carry all property of user defined by me 


declare module 'next-auth' {
    interface User{
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string
    }
    interface Session{
       user:{
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string
       } & DefaultSession['user']

    }
}
// one more way to modify
declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string
    }
}