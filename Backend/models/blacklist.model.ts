import mongoose from "mongoose";

const blacklistSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true }
}, {
    versionKey: false
})

const blacklistModel = mongoose.model("blacklist", blacklistSchema);

export default blacklistModel