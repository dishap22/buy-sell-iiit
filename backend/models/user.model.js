import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    contactNumber : { type: Number, required: true },
    password: { type: String, required: true },
    /* TODO: figure out how to store cart, reviews */  
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;