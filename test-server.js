const { z } = require("zod");
const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

const taskSchema = new mongoose.Schema({
  title: String,
  dueDate: { type: Date, default: null }
});
const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const task = await Task.create({ title: "Test task", dueDate: new Date("2026-05-15T00:00:00.000Z") });
  console.log(task.dueDate);
  await Task.deleteOne({ _id: task._id });
  mongoose.disconnect();
}
run();
