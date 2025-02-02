import mongoose from 'mongoose';

const AssignmentSchema = new mongoose.Schema({
  rotation: { type: String, required: true, unique: true },
  Monday: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
  Tuesday: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
  Wednesday: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
  Thursday: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
  Friday: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
});

const Assignment = mongoose.models.Assignment || mongoose.model('Assignment', AssignmentSchema);

export default Assignment;
