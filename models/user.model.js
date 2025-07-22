import { model, Schema, Types } from "mongoose";

const userSchema = new Schema({
    name: { type: String, required: true },
    mail: { type: String, required: true },
    password: { type: String, required: true },
    // tasks: [{ type: Types.ObjectId, ref: "Task" }]
});

export default model("User", userSchema);