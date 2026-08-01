require("dotenv").config()

const app = require("./app")
const connectDB = require("./database/db")

const PORT = process.env.PORT || 5000

const startServer = async () => {
    try{
        await connectDB()
        console.log("Starting authentication backend from:", process.cwd())
        console.log("Using CLIENT_URL:", process.env.CLIENT_URL)
        app.listen(PORT,()=>{
            console.log(`server running on Port ${PORT}`)
        })

    }catch(error){
        console.log(error)
    }
}

startServer()


