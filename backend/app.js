require('dotenv').config();

const config = require('./config.json');
const mongoose = require('mongoose');

mongoose.connect(config.connectionString);

const User = require('./models/userModel');
const Note = require('./models/noteModel')


const express = require('express');
const app = express();
const cors = require('cors');
const port = 8000;

const jwt = require('jsonwebtoken');
const {authenticateToken} = require('./utilities');
const { token } = require('morgan');

app.use(cors({
    origin: '*',
}));
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('The server is working');    
})

//create account
app.post('/create-account', async (req, res) => {
    if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ error: true, message: 'Invalid or missing JSON body' });
    }

    const { fullName, email, password } = req.body;

    if (!fullName) {
        console.log('Full name is required');
        return res.status(400).json({ error: true, message: 'Full name is required' });
    }
    if (!email) {
        console.log('Please enter your email');
        return res.status(400).json({ error: true, message: 'Email is required' });
    }
    if (!password) {
        console.log('Please enter your password');
        return res.status(400).json({ error: true, message: 'Password is required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        console.log('User with this emailalready exists');
        return res.status(409).json({ error: true, message: 'Email already exists' });
    }

    const user = new User({
        fullName,
        email,
        password,
    })
    await user.save();
    
    const accessToken = jwt.sign({user
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '36000m'
    });
    console.log('Registration Successful',user);
    return res.json({error: false, user, accessToken, message:'Registration Successful'});
    
})

//Get User
app.get('/get-user', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const isUser = await User.findById(userId);
      if (!isUser) {
        console.log("User not found");
        return res.status(404).json({ error: true, message: "User not found" });
      }
      console.log("User fetched successfully", {
        isUser: {
          fullName: isUser.fullName,
          email: isUser.email,
          id: isUser._id,
          createdOn: isUser.createdOn
        }
      });      
      return res.json({ error: false, user: {fullName:isUser.fullName,email:isUser.email, id:isUser._id, createdOn:isUser.createdOn}, message: "User fetched successfully" });
    } catch (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ error: true, message: "Server error" });
    }
  });

//login route
app.post('/login',async (req,res)=>{
    let {email,password} = req.body;
    if(!email){
        console.log("Email is required")
        return res.status(400).json({error:true,message:'Email is required'});
    }
    if(!password){
        console.log("Please enter your Password ")
        return res.status(400).json({error:true,message:'Please enter your password'});;
    }

    const userInfo = await User.findOne({email});
    if(!userInfo){
        console.log("User not found");
        return res.status(404).json({error:true,message:'User not found'});
    }
    if(userInfo.password !== password){
        console.log("Incorrect Password");
        return res.status(401).json({error:true, message:"Password did not match"})
    }
    if(userInfo.email == email && userInfo.password == password){
        const accessToken = jwt.sign({ id: userInfo._id, email: userInfo.email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '36000m'
        });
        console.log("Login successful",email)
        return res.json({error:false, email, accessToken, message:'Login Successful'});
    }else{
        console.log("Login failed");
        return res.status(401).json({error:true, message:'Login failed'});
    }
})

//add note route
app.post('/add-note',authenticateToken, async(req,res)=>{
    const {title,content,tags} = req.body;
    const userId = req.user.id; 
    if(!title){
        console.log("Title is required");
        return res.status(400).json({error:true,message:'Title is required'});
    }
    if(!content){
        console.log("Content is required");
        return res.status(400).json({error:true,message:'Description is required'});
    }
    try{
        const note = new Note({
            title,
            content,
            tags:tags || [] ,
            userId,
        })
        await note.save();
        console.log("Note added successfully",note);
        return res.json({error:false,note,message:'Note added successfully'});
    }catch(err){
        console.log("failed to add the note",err);
        return res.status(500).json({error:true,message:'Internal server error'});
    }
})


//edit note route
app.put('/edit-note/:noteId',authenticateToken, async(req,res)=>{
    const noteId = req.params.noteId;
    const {title,content,tags,isPinned} = req.body;
    const userId = req.user.id; 

    if(!title && !content && !tags){
        console.log("No changes made");
        return res.status(400).json({error:true,message:'No changes made'});
    }
    try{
        const note = await Note.findOne({_id:noteId,userId});
        if(!note){
            console.log("Note not found")
            return res.status(404).json({error:true, message:"Note not found"});
        }
        if(title){
            note.title = title;
        }
        if(content){
            note.content = content;
        }
        if(tags){
            note.tags = tags;
        }
        if(isPinned){
            note.isPinned = isPinned;
        }

        await note.save();
        console.log("Note edited successfully",note);
        return res.json({error:false,note,message:'Note edited successfully'});

    }catch(err){
        console.log("failed to edit the note",err);
        return res.status(500).json({error:true,message:'Internal server error'});
    }
})

///get all notes route

app.get('/get-all-notes',authenticateToken, async(req, res)=>{
    const userId = req.user.id;
    try{
        const notes = await Note.find({ userId }).sort({ isPinned: -1 });
        console.log("Notes fetched successfully",notes);
        return res.json({error:false,notes,message:'Notes fetched successfully'});

    }catch(err){
        console.log("failed to get the notes",err);
        return res.status(500).json({error:true,message:'Internal server error'});
    }
})


//delete notes
app.delete('/delete-note/:noteId',authenticateToken, async(req,res)=>{
    const noteId = req.params.noteId;
    const userId = req.user.id;
    try{
        const note = await Note.findOne({_id:noteId,userId});
        if(!note){
            console.log("Note not found")
                return res.status(404).json({error:true, message:"Note not found"});        
        }
        await Note.deleteOne({_id:noteId,userId});
        console.log("Note deleted successfully",note);
        return res.json({error:false,message:'Note deleted successfully'});
    }catch(err){
        console.log("failed to delete the note",err);
        return res.status(500).json({error:true,message:'Internal server error'});
    }
})

//update isPinned value route
app.put('/update-note-pinned/:noteId',authenticateToken, async(req,res)=>{
    const noteId = req.params.noteId;
    const {isPinned} = req.body;
    const userId = req.user.id;

    try{
        const note = await Note.findOne({_id:noteId,userId});
        if(!note){
            console.log("Note not found")
            return res.status(404).json({error:true, message:"Note not found"});
        }
        if(isPinned){
            note.isPinned = isPinned || false;
        }
        await note.save();
        console.log("Note pinned value updated successfully",note);
        return res.json({error:false,note,message:'Note pinned value updated successfully'});
    }catch(err){
        console.log("failed to update the pinned value",err);
        return res.status(500).json({error:true,message:'Internal server error'});
    }
})


//search notes route
app.get('/search-notes', authenticateToken, async (req, res) => {
    const userId = req.user.id; 
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: true, message: 'Query parameter is required' });
    }

    try {
        const notes = await Note.find({
            userId,
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } },
            ],
        });
        res.json({ error: false, notes });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Server error' });
    }
});




app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})


// praneeth login token
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTI1NDZmY2YwOGYzZjY1OWIzM2NkZiIsImVtYWlsIjoicHJhbmVldGhAZ21haWwuY29tIiwiaWF0IjoxNzQ2MTEyNzMwLCJleHAiOjE3NDgyNzI3MzB9.KV-hpqhJvI1u2wwX0HIWApLApTOazl9bp2MB3yX_zXI