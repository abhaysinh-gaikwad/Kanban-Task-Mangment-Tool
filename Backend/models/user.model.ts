import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
    name: string
    email: string,
    password: string,
}

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, {
    versionKey: false
})

const UserModel = mongoose.model("User", userSchema);

export default UserModel 