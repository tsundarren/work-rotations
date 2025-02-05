import { connectToDatabase } from '@/lib/mongoose';
import Employee from '@/models/Employee';

export async function GET() {
  await connectToDatabase();

  try {
    const employees = await Employee.find({});
    return new Response(JSON.stringify(employees), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Error fetching employees', error }),
      { status: 500 }
    );
  }
}
