const { ObjectId } = require("mongodb");

const mongoose = require("mongoose");

// automatically creates a schema
const homeSchema = mongoose.Schema({
    houseName: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    rating: { type: Number, required: true },
    photo: String,
    description: String,
    // _id: { type: ObjectId, required: true } // Mongoose automatically
});


//bija koi pn function ma home delete thay to ee badhe thi delete thay jay enu dhyan aa 
// pre hook rakhe....so e kam nu chhe em 
// homeSchema.pre('findOneAndDelete', async function (next) {
//     const homeId = this.getQuery()._id;
//     await favourite.deleteMany({ houseId: homeId });
//     console.log("Associated favourites deleted for home ID:", homeId);

//     next();
// });

module.exports = mongoose.model('Home', homeSchema);











/**
    avu hatu mongobd use kariye or biju kai use kariye tyare....
    
    save()
    fetchAll()
    FindByID(homeId)
    deleteById(homeId)

 */

