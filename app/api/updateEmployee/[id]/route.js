import { connectToDatabase } from '@/lib/mongoose';
import Employee from '@/models/Employee';

export async function PATCH(req, { params }) {
  const { id } = await params;

  try {
    // Connect to the database
    await connectToDatabase();

    // Parse the request body to get the updated trained rotations and role
    const { trainedRotations, role } = await req.json();

    // Validate input
    const updates = {};
    if (trainedRotations && trainedRotations.length > 0) {
      updates.trainedRotations = trainedRotations;
    }

    if (role) {
      updates.role = role; // Update role if provided
    }

    if (Object.keys(updates).length === 0) {
      return new Response(
        JSON.stringify({ message: 'No fields to update' }),
        { status: 400 }
      );
    }

    // Update the employee in the database
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id, 
      updates, 
      { new: true } // This will return the updated employee
    );

    if (!updatedEmployee) {
      return new Response(
        JSON.stringify({ message: 'Employee not found' }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Employee updated successfully', employee: updatedEmployee }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating employee:', error);
    return new Response(
      JSON.stringify({ message: 'Error updating employee', error: error.message }),
      { status: 500 }
    );
  }
}
