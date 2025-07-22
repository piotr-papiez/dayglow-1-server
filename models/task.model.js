import { model, Schema, Types } from "mongoose";

const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    description: String
});

export default model("Task", taskSchema);