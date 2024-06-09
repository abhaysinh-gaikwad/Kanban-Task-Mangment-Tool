import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['Todo', 'Doing', 'Done'], default: "Todo" },
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: "Board" },
    subtasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubTask" }]
}, {
    versionKey: false
})

const TaskModel = mongoose.model('Task', taskSchema);

export default TaskModel; 