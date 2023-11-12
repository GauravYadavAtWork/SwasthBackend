import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import bodyParser from "body-parser";

const router=express.Router();

dotenv.config();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

mongoose.connect(`mongodb+srv://${process.env.DATABASEID}:${process.env.DATABASEPASSWORD}@cluster0.o0hdixo.mongodb.net/Swasth`,{
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
    console.log('Connected to the swasth database');
});


const usersSchema = new mongoose.Schema({
    _id: Number,
    Role : String,
    Name: String,
    FirstName: String,
    LastName: String,
    Password:String,
});
const user = mongoose.model("registerLogin", usersSchema);

router.post("/register", (req, res) => {
    const mobileNumber = req.body.mobileNumber;
    const firstName = req.body.FirstName;
    const lastName = req.body.LastName;
    const role = req.body.Role;
    const Password =req.body.Password;

    const newUser = new user({
        _id: mobileNumber,
        role: role,
        FirstName: firstName,
        LastName: lastName,
        Password: Password,
    });

    newUser.save()
        .then(() => {
            console.log("New user Added with _id " + mobileNumber);
            res.status(200).send("User registered successfully");
        })
        .catch((error) => {
            if (error.code === 11000) {
                console.log("User Already Exists");
                res.status(400).send("User already exists");
            } else {
                console.error(error);
                res.status(500).send("Internal Server Error");
            }
        });
});


router.post("/login",(req,res)=>{
    const mobileNumber = req.body.mobileNumber;
    const password = req.body.Password;
    user.findOne({_id : mobileNumber})
    .then(details=>{
        console.log(details.Password);
        console.log(details);
        if(details.Password===password){
            res.send("Authorized User");
        }else{
            res.send("Invalid Password");
        }
    })
    .catch(err=>{
        res.send(err);
    })
});

export default router;