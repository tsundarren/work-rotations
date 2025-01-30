import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  trainedRotations: { type: [String], required: true },
  role: { type: String, required: true }, // Add the role field
});

const Employee = mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);

export default Employee;
