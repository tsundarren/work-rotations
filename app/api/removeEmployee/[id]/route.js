import { connectToDatabase } from '@/lib/mongoose';
import Employee from '@/models/Employee';

export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();

    // Correct way to extract params in Next.js App Router
    const { id } = await params; // ✅ Awaiting params before accessing

    if (!id) {
      return new Response(JSON.stringify({ message: 'Employee ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return new Response(JSON.stringify({ message: 'Employee not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Employee removed successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error deleting employee:', err);
    return new Response(JSON.stringify({ message: 'Failed to remove employee' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
