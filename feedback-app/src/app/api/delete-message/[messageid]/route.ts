import { getServerSession } from "next-auth"; // to get session from backend directly
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server"; // Import from next/server

export async function DELETE(request: NextRequest, context: any) { // Bypass TypeScript typing using `any`
    const { messageid } = context.params; // Directly access params (no await needed)

    await dbConnect();

    // Get session using getServerSession with authOptions for validation
    const session = await getServerSession(authOptions);

    // Ensure the user is authenticated before proceeding
    if (!session || !session.user) {
        return NextResponse.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 });
    }

    const user: User = session.user as User; // Define the user as a typed User

    try {
        // Try to update the user model, pulling the message from the user's messages array
        const updateResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageid } } }
        );

        // If no messages were modified, return a 404 response
        if (updateResult.modifiedCount === 0) {
            return NextResponse.json({
                success: false,
                message: "Message not found or already deleted"
            }, { status: 404 });
        }

        // Return a successful response if the message was deleted
        return NextResponse.json({
            success: true,
            message: "Message Deleted"
        }, { status: 202 });

    } catch (error) {
        console.error("Error in delete message route", error);
        // Return a 500 error if there was an issue with the delete operation
        return NextResponse.json({
            success: false,
            message: "Error deleting message"
        }, { status: 500 });
    }
}
