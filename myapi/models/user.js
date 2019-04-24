const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define a schema
const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
// Create the model from the schema and export it
module.exports = mongoose.model('User', userSchema);
