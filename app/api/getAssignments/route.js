import { connectToDatabase } from '@/lib/mongoose';
import Assignment from '@/models/Assignment';

export async function GET() {
  await connectToDatabase();

  try {
    // Fetch assignments and populate employee details for each day
    const assignments = await Assignment.find().populate([
      { path: 'Monday', select: 'firstName lastName' },
      { path: 'Tuesday', select: 'firstName lastName' },
      { path: 'Wednesday', select: 'firstName lastName' },
      { path: 'Thursday', select: 'firstName lastName' },
      { path: 'Friday', select: 'firstName lastName' },
    ]);

    return new Response(JSON.stringify(assignments), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Error fetching assignments', error }),
      { status: 500 }
    );
  }
}
