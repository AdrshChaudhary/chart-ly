
import { NextResponse } from 'next/server';

const dummyInsight = `
- **Total Sales Analysis**: The total sales for the period is **$38,750**. The highest sales were recorded in December 2023 ($5,800), and the lowest were in May 2023 ($1,890). There is a clear upward trend in sales towards the end of the year, suggesting strong seasonal performance or business growth.
- **Profitability Insights**: The total profit stands at **$51,806**. The most profitable month was March 2023 ($9,800), which surprisingly did not have the highest sales, indicating a high-margin transaction. The profit margin is inconsistent across months.
- **Regional Performance**: The West and South regions are the top performers in terms of both sales and user acquisition. The East region shows potential for growth but currently lags behind.
- **User Growth**: User count has been steadily increasing, starting from 100 in January and reaching 230 by December, which is a 130% increase over the year.
`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = body.data;

    // TODO: Here is where you would forward the request to your Python backend.
    // For now, we will return a dummy response after a short delay.
    
    console.log("Received data for analysis:", data.length, "rows");

    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return NextResponse.json({ insights: dummyInsight });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to process the request', details: error.message }, { status: 500 });
  }
}
