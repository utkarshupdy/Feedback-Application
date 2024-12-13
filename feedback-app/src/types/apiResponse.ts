import { Message } from "postcss";


export interface ApiResponse{
    success: boolean;
    message: string;
    isAcceptingMessage?: boolean // means assign it as optional means it not necessary to be in api response , but if it exist , its type is this .....
    messages?: Array<Message>
}

