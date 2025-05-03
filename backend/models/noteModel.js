const mongoose = require('mongoose');

//create a schema
const noteSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    tags:{
        type:[String],
        default:[]
    },
    isPinned:{
        type:Boolean,
        default:false,
    }, 
    userId :{
        type:mongoose.Schema.Types.ObjectId,
        //type:String,
        ref:'User',
        required:true
    },
    createdOn:{
        type:Date,
        default:Date.now()
    }
})

//create model and then export it 
module.exports = mongoose.model("Note",noteSchema);