const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://ruby1103:plantcell@cluster0.1qqtcld.mongodb.net/foodie';

module.exports = async function initializeDatabase(callback) {
    try {
        await mongoose.connect(mongoURI, { useNewUrlParser: true });
        console.log("Connected to MongoDB");

        const foodCollection = mongoose.connection.db.collection("food_items");
        const categoryCollection = mongoose.connection.db.collection("foodCategory");

        const foodData = await foodCollection.find({}).toArray();
        const categoryData = await categoryCollection.find({}).toArray();

        callback(null, foodData, categoryData);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        callback(error);
    }
};
