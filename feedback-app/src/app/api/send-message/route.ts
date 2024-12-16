import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User"; // mainly just used in type safety


export async function POST(request: Request){
    await dbConnect();

    // now message can be send by anyone , no need to be logged in
    const {username , content} = await request.json()
    try {

        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            } , {status: 404})
        }
        // now check , if user accepting messages or not
        if(!user.isAcceptingMessage){
            return Response.json({
                success: false,
                message: "Username is not accepting feedback"
            } , {status: 403})
        }

        const newMessage = {content , createdAt: new Date()}
        user.messages.push(newMessage as Message) // only sending newMessage creates a issue as its a typescript issue , as we set a particular type of Message in user model . we have to assure the message we are sendkin g are of type message only 
        await user.save();

        return Response.json({
            success: true,
            message: "Message send successfully"
        } , {status: 202})
        
    } catch (error) {
        console.log("Error adding messages" , error);
        return Response.json({
            success: false,
            message: "Internal server error"
        } , {status: 500})
        
    }
}


