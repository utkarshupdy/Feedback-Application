import { Message } from "@/model/User";


export interface ApiResponse{
    success: boolean;
    message: string;
    isAcceptingMessage?: boolean // means assign it as optional means it not necessary to be in api response , but if it exist , its type is this .....
    messages?: Message[];
}

