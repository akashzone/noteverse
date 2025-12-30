
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
require('dotenv').config();


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.get("/api/test",(req,res)=>{
    res.json({message : "API is working properly" });
})


mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDB Connected");
    app.listen(process.env.PORT, () => {
      console.log("Server running on port " + process.env.PORT);
    });
})
.catch((err)=>{
    console.log("Error :"+err);
})
