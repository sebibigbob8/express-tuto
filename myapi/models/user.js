const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define a schema
const userSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String
    }
});
// Create the model from the schema and export it
module.exports = mongoose.model('User', userSchema);
