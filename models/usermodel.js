import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    answer: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        enum: ["user", "admin", "manager", "employee"],
        default: "user",
    }
}, { timestamps: true });

export default mongoose.model('user', userSchema)