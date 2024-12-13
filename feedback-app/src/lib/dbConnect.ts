import mongoose from "mongoose"

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void>{  // in typescript , meaning is void is not null , but the meaning of void is i dont care , which type of data it gives or returns
    if(connection.isConnected){
        console.log("Already connected to database"); 
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || ' ' , {})

        connection.isConnected =  db.connections[0].readyState
        console.log("DB Connected Successfully")
        
    } catch (error) {
        console.log("DB Connection failed" , error);
        process.exit(1);
        
    }

} 
export default dbConnect;
