import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  trainedRotations: { type: [String], default: [] }, // List of rotations the employee is trained for
});

// Prevent redefining the model during hot reloads in development
const Employee = mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);

export default Employee;
