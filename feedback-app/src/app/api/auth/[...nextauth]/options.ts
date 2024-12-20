import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        // now authorise this given data with database data
        await dbConnect();
        try {
            const user = await UserModel.findOne({
                $or: [           // this operatror is given by mongodb
                    {email : credentials.identifier},
                    {username : credentials.identifier}

                ]
            })
            if(!user){
                throw new Error("No user found with this email");
            }
            if(!user.isVerified){
                throw new Error("Please verify your account first");
            }
            const isPasswordCorrect = await bcrypt.compare(credentials.password , user.password);
            if(isPasswordCorrect){
                return user;
            }
            else{
                throw new Error("Incorrect Password");
            }
        } catch (err : any) {
            throw new Error(err);
            
        }

        
      },
    }),
    // if u want to login via github , just add github provider here 
    // if u want to login via google , just add google provider here 
  ],

  callbacks:{
    async session({ session, token }) { // all these data inject in session of user ... not in next-auth session ... to these data can be extracted by user session
        if(token){
            session.user._id = token._id;
            session.user.isVerified = token.isVerified;
            session.user.isAcceptingMessages = token.isAcceptingMessages;
            session.user.username = token.username;
        }
        return session
    },
    async jwt({ token, user}) {  // user comes from above provider where we return user 
        if(user){
            token._id = user._id?.toString()
            token.isVerified = user.isVerified;
            token.isAcceptingMessages = user.isAcceptingMessages;
            token.username = user.username;

        }
        return token
    }

  },

  pages:{
    signIn: '/sign-in'
  },

  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXT_AUTH_SECRET ,

};
