import {resend} from "@/lib/resend"

import VerificationEmail from "../../emails/verificationEmail"
import { ApiResponse } from "@/types/apiResponse"

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string

): Promise<ApiResponse>{ // if u not five proper try catch return response , it will give u error
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email ,
            subject:'Feedback Application | Verification Code' ,
            react: VerificationEmail({username , otp : verifyCode}) // returns a react component to send in email
        });




        return { success: true , message: 'Verification email send successfully'}
    } catch (emailError) {
        console.error("Error sending verification email" , emailError)
        return { success: false , message: 'Failed to send verification email'}

    }
}; 



