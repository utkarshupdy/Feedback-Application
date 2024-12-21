import { getServerSession } from "next-auth/next"; // gives session object from backend directly .. so that it doesnot relay on frontend
// getServerSession also require auth options to verify

import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

import { User } from "next-auth";
import mongoose from "mongoose";

// export async function GET(request: Request){
export async function GET(){
    await dbConnect();
    const session = await getServerSession(authOptions);
    // const user: User = session?.user as User ........... if want to define types
    const _user: User = session?.user as User 
    

    if(!session || !_user){
        return Response.json({
            success: false,
            message: "Not Authenticated"
        } , {status: 401})
    }

    const userId = new mongoose.Types.ObjectId(_user._id); // many time user._id is in string format .. so which writing aggregation , it creates issue ,so better to chamge string back in normal form , that why this time  we get id from mongoose .types.onjectid(user._id)

    try {
        const user = await UserModel.aggregate([
            { $match: {_id : userId}} , 
            // now we have to unwind the array , so that array opens up and every elements in array opens up as object
            {$unwind: '$messages'},
            // now u allowed to sort the data / elements of array
            {$sort : {'messages.createdAt' : -1}},
            {$group : {_id: '$_id' , messages: {$push: '$messages'}}}
        ]).exec();

        console.log(user);
        console.log(user.length);

        if(!user){
            return Response.json({
                success: false,
                // message: "User not found"
                message: "User not found"
            } , {status: 401})
        }
        if(user.length === 0){
            return Response.json({
                success: true,
                message: "Currently , there is no feedback for this user"
            } , {status: 202})
        }
        return Response.json({
            success: true,
            message: "Recent Feedback fetched successfully" ,
            messages: user[0].messages 
        } , {status: 200})
        
    } catch (error) {
        console.log("An unexpected error occured" , error);
        return Response.json({
            success: false,
            message: "An unexpected error occured"
        } , {status: 500})
        
    }
}