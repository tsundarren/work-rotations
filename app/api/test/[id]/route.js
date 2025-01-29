// app/api/test/[id]/route.js

export async function GET(request, { params }) {
    const { id } = params; // Capture the dynamic 'id' parameter
  
    console.log('Received ID:', id); // Log the ID to verify it's being captured
  
    return new Response(
      JSON.stringify({ id }), 
      { status: 200 }
    );
  }
  