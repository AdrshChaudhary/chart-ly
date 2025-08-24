
import { NextResponse } from 'next/server';

// This file acts as a proxy to your Python backend.
// It is configured to forward requests to the default local Python server URL.
// You can modify `pythonBackendUrl` if your Python server is running elsewhere.

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // URL of your running Python backend service
    const pythonBackendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/insights';

    const response = await fetch(pythonBackendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Pass the backend error message to the frontend for better debugging
      const errorData = await response.text();
      console.error(`Backend error: ${response.status} ${errorData}`);
      return NextResponse.json(
        { error: 'Backend service failed to generate AI insights.', details: errorData },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Failed to forward request to Python backend:', error);
    // Handle network errors or other issues when trying to contact the Python service
    return NextResponse.json(
      { error: 'Failed to connect to the backend service.', details: error.message },
      { status: 500 }
    );
  }
}
