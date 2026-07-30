require("dotenv").config()

const app = require("./app")
const connectDB = require("./database/db")

const PORT = process.env.PORT 

const startServer = async () => {
    try{
        await connectDB()
        app.listen(PORT,()=>{
            console.log(`server running on Port${PORT}`)
        })

    }catch(error){
        console.log(error)
    }
}

startServer()


