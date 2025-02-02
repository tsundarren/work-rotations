import { connectToDatabase } from '@/lib/mongoose';
import Assignment from '@/models/Assignment';
import Employee from '@/models/Employee'; // Import the Employee model

export async function PATCH(req, { params }) {
  const { rotation } = await params;
  const { assignments } = await req.json();  // Get the updated assignments from the request body

  try {
    // Connect to the database
    await connectToDatabase();

    // Update the assignment document
    const updatedAssignment = await Assignment.findOneAndUpdate(
      { rotation },
      {
        $set: {
          'Monday': assignments[rotation]?.Monday || [],
          'Tuesday': assignments[rotation]?.Tuesday || [],
          'Wednesday': assignments[rotation]?.Wednesday || [],
          'Thursday': assignments[rotation]?.Thursday || [],
          'Friday': assignments[rotation]?.Friday || [],
        },
      },
      { new: true, upsert: true }
    );

    // If the assignment was successfully updated, update the employees' assigned rotations
    if (updatedAssignment) {
      // For each day in the assignment, update the assigned rotations for the employee
      for (const day in assignments[rotation]) {
        const employeeId = assignments[rotation][day];
        if (employeeId) {
          // Update the employee's assigned rotations
          await Employee.findByIdAndUpdate(
            employeeId,
            {
              $addToSet: { assignedRotations: rotation }, // Ensure the rotation is added only once
            }
          );
        }
      }
    }

    return new Response(
      JSON.stringify({ message: 'Assignment updated successfully', assignment: updatedAssignment }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating assignment:', error);
    return new Response(
      JSON.stringify({ message: 'Error updating assignment', error: error.message }),
      { status: 500 }
    );
  }
}
