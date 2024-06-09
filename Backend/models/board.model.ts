import mongoose from 'mongoose';



const boardSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: "Board" }
}, {
    versionKey: false
})

const BoardModel = mongoose.model('Board', boardSchema);

export default BoardModel;