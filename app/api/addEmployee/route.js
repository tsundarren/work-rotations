import { connectToDatabase } from '@/lib/mongoose';
import Employee from '@/models/Employee';

export async function POST(req) {
  try {
    const { firstName, lastName, trainedRotations, role } = await req.json();

    // Validate required fields
    if (!firstName || !lastName || !trainedRotations || trainedRotations.length === 0 || !role) {
      return new Response(
        JSON.stringify({ message: 'Missing required fields' }),
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Try to find the employee by first and last name
    const existingEmployee = await Employee.findOne({ firstName, lastName });

    if (existingEmployee) {
      // If the employee exists, update their trainedRotations (add new ones)
      const updatedRotations = [
        ...new Set([...existingEmployee.trainedRotations, ...trainedRotations]), // Prevent duplicates
      ];
      
      existingEmployee.trainedRotations = updatedRotations;
      await existingEmployee.save();

      return new Response(
        JSON.stringify({ message: 'Employee updated successfully', employee: existingEmployee }),
        { status: 200 }
      );
    } else {
      // If the employee doesn't exist, create a new one
      const employee = new Employee({
        firstName,
        lastName,
        trainedRotations,
        role, // Save the role
        assignedRotations: [] // Initialize assignedRotations as an empty array
      });
      await employee.save();

      return new Response(
        JSON.stringify({ message: 'Employee added successfully', employee }),
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Error adding employee:', error);
    return new Response(
      JSON.stringify({ message: 'Error adding employee', error: error.message }),
      { status: 500 }
    );
  }
}
