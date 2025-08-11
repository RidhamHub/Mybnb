
const mongoose = require("mongoose");

// automatically creates a schema
const userSchema = mongoose.Schema({ 
    firstName: { type: String, required: [true , 'Firstname is required'] },
    lastName: { type: String },
    email: { type: String, required: [true, 'Lastname is required'], unique: true },
    password: { type: String, required: [true, 'Password is required'] },
    userType: { type: String, default: 'guest', enum: ['guest', 'host'] }, // 'guest' or 'host'
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Home' }],
   
}); 




module.exports = mongoose.model('User', userSchema);











/**
    avu hatu mongobd use kariye or biju kai use kariye tyare....
    
    save()
    fetchAll()
    FindByID(homeId)
    deleteById(homeId)

 */

