import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  trainedRotations: { type: [String], required: true }, // Rotations the employee is trained for
  assignedRotations: { type: [String], default: [] },  // Rotations assigned to the employee
  role: { type: String, required: true }, // Role of the employee
});

const Employee = mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);

export default Employee;
