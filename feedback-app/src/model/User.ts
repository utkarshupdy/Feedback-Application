import mongoose , {Schema , Document} from "mongoose";

export interface Message extends Document{
    content: string;
    createdAt: Date
}

const MessageSchema : Schema<Message> = new Schema({ // gives only type safty when custom schema is made
    content : {
        type: String,
        required: true
    },
    createdAt : {
        type: Date,
        required : true,
        default: Date.now 
    }


})

export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    message: Message[]
}

const UserSchema : Schema<User> = new Schema({ // gives only type safty when custom schema is made
    username : {
        type: String,
        required: [true , "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please use a valid email address']
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "Code is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Expiry date is required"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: false,
    },
    message : [MessageSchema]
    
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User" , UserSchema)) // as nextJs runs in serverless mode, we need to make sure that the model is created before we use it , if it is not created then we return an empty object or create it at this place itself
export default UserModel ;