import { connectToDatabase } from '@/lib/mongoose';
import Assignment from '@/models/Assignment';
import Employee from '@/models/Employee';

export async function PATCH(req, { params }) {
  const { rotation } = await params;
  const { assignments } = await req.json();

  try {
    // Connect to the database
    await connectToDatabase();

    // Update the assignment document
    const updatedAssignment = await Assignment.findOneAndUpdate(
      { rotation },
      {
        $set: {
          Monday: assignments[rotation]?.Monday || [],
          Tuesday: assignments[rotation]?.Tuesday || [],
          Wednesday: assignments[rotation]?.Wednesday || [],
          Thursday: assignments[rotation]?.Thursday || [],
          Friday: assignments[rotation]?.Friday || [],
        },
      },
      { new: true, upsert: true }
    );

    if (updatedAssignment) {
      // Get all assigned employees for this rotation across all days
      const assignedEmployees = new Set();
      Object.values(assignments[rotation]).forEach((employeeId) => {
        if (employeeId) assignedEmployees.add(employeeId);
      });

      // Remove the rotation from employees who are no longer assigned
      await Employee.updateMany(
        { assignedRotations: rotation, _id: { $nin: Array.from(assignedEmployees) } },
        { $pull: { assignedRotations: rotation } }
      );

      // Add the rotation to assigned employees
      for (const day in assignments[rotation]) {
        const employeeId = assignments[rotation][day];
        if (employeeId) {
          await Employee.findByIdAndUpdate(employeeId, {
            $addToSet: { assignedRotations: rotation },
          });
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
