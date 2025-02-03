import { connectToDatabase } from '@/lib/mongoose';
import Employee from '@/models/Employee';

export async function POST(req) {
  try {
    const { firstName, lastName, trainedRotations, role } = await req.json();

    // Validate required fields (only first name and last name are required)
    if (!firstName || !lastName) {
      return new Response(
        JSON.stringify({ message: 'Missing required fields' }),
        { status: 400 }
      );
    }

    // Default role if not provided
    const finalRole = role || 'Specimen Accessioner';

    await connectToDatabase();

    const existingEmployee = await Employee.findOne({ firstName, lastName });

    if (existingEmployee) {
      const updatedRotations = [
        ...new Set([...existingEmployee.trainedRotations, ...trainedRotations]),
      ];

      existingEmployee.trainedRotations = updatedRotations;
      await existingEmployee.save();

      return new Response(
        JSON.stringify({ message: 'Employee updated successfully', employee: existingEmployee }),
        { status: 200 }
      );
    } else {
      const employee = new Employee({
        firstName,
        lastName,
        trainedRotations,
        role: finalRole, // Use the default role if not provided
        assignedRotations: [],
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
