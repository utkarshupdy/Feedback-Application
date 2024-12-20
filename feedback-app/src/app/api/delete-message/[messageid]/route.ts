import { getServerSession } from "next-auth"; // gives session object from backend directly .. so that it doesnot relay on frontend
// getServerSession also require auth options to verify

import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

import { User } from "next-auth";
// import mongoose from "mongoose";

export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {

    const messageId = params.messageid
    await dbConnect();
    const session = await getServerSession(authOptions);
    // const user: User = session?.user as User ........... if want to define types
    const user: User = session?.user as User


    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }

    try {
        const updateResult = await UserModel.updateOne(
            { _id: user._id } // means which user whoose id needs to be deleted
            , { $pull: { messages: { _id: messageId } } }
        )

        if (updateResult.modifiedCount == 0) {
            return Response.json({
                success: false,
                message: "Message not found or already deleted"
            }, { status: 404 })
        }
        return Response.json({
            success: true,
            message: "Message Deleted"
        }, { status: 202 })

    } catch (error) {
        console.log("Error in delete message route", error);
        return Response.json({
            success: false,
            message: "Error deleting message"
        }, { status: 500 })

    }






}
