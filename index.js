//Importing dependencies and structured functions of full app
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const app = express()
const {connectdb} = require('./db/db')
const {errorHandler} = require('./middlewares/errorMiddleware')
const userRoute = require('./routes/user')
const passwordRoute = require('./routes/password')
const profileRouter = require('./routes/profileRoute')
const path = require('path')
const port = process.env.PORT || 4000

//db connection (if failed, further process will exits as applied in db connection file i.e. db.js)
connectdb()

//Default Home Route

//static files handlings for build folder

// if(process.env.NODE_ENV === 'production'){
//     app.use(express.static('build'))
//     const path = require('path')
//     app.get('/',(req,res)=>{
//         res.sendFile(path.resolve(__dirname,'build','index.html'))
//     })
// }
// OR

app.use(express.static("client/build"))
app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,"client","build"))
})

//dependencies injections
app.use(express.json())
app.use(cors())
app.use(helmet())

//Using the Routes of whole app
app.use('/api/users',userRoute)
app.use('/api/passwords',passwordRoute)
app.use('/api/profile',profileRouter)

//Error Handler
// app.use(notfound)
app.use(errorHandler)

//listening on specific port for local host
app.listen(port, () => console.log(`Example app listening on port ${port}!`))