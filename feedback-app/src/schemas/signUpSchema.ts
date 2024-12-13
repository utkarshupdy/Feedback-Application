import { z } from "zod" // zod is basically use to validate the data , its a schema validation library which is generally used for data validation in the backend without explicitly writing the validation logic

export const usernameValidation = z
        .string()
        .min(3, { message: "Username must be at least 3 characters long"})
        .max(20 ,"Username must be at most 20 characters long")
        .regex( /^[a-zA-Z0-9_]+$/ , "Username must not contain special characters")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid Email Address"}),
    password: z.string().min(6 , {message: "Password must be atleast 6 characters long"}),
})