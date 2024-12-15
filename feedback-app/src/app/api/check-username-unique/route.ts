// to check username is unique or note
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod"
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

// i want to check if user creating a username , it auto matically checks in backend if its valid username or not
export async function GET(request : Request){

    // use this in all other routes
    if(request.method !== 'GET'){
        return Response.json({
            success : false,
            message: 'Only GET method is allowed', 
        } , {status: 405})
    }

    await dbConnect();
    // dummy url localhost:3000/api/cuu?username=hitesh?phone=android?.....
    try {
        const {searchParams} = new URL(request.url)
        const queryParams = { // its an object ...
            username: searchParams.get('username')
        }
        // validate username with zod
        const result = UsernameQuerySchema.safeParse(queryParams) // it check username and verify it 
        // console.log(result);
        if (!result.success) {
            const usernameError = result.error.format().username?._errors || []

            return Response.json({
                success : false,
                message: usernameError?.length > 0 ? usernameError.join(', ') : 'Invalid query parameters' , 
            } , {status: 400})
        }
        // if username is valid then return success

        const {username} =  result.data
        const existingVerifiedUser = await UserModel.findOne({username , isVerified: true })

        if(existingVerifiedUser){
            return Response.json({
                success : false,
                message: 'Username is already taken', 
            } , {status: 400})
        }
        return Response.json({
            success : true,
            message: 'Username is unique' , 
        } , {status: 202})




    } catch (error) {
        console.error("Error checking username" , error)
        return Response.json({
            success: false,
            message: "Error checking username"
        },
    {
        status: 500
    })
        
    }
}