import mongoose from 'mongoose';


const subtaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    isCompleted: { type: Boolean, required: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" }
}, {
    versionKey: false
})

const SubtaskModel = mongoose.model('SubTask', subtaskSchema);

export default SubtaskModel; 