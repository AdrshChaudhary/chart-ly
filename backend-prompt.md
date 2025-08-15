# Prompt for Building the Python Backend for Chartly

## Project Overview

You are building the Python backend for a web application called "Chartly." The frontend is built with Next.js and allows users to upload data files (CSV, XLSX, JSON) and instantly see an interactive, Power BI-style dashboard with charts and AI-generated insights.

The frontend is already complete. Your task is to build the Python backend that will handle all the data processing, chart recommendations, and AI analysis using the Google Gemini API. The backend should be a separate service (using a framework like Flask or FastAPI) that the Next.js application will call.

## Core Task

Create two API endpoints in Python that will receive data from the Next.js frontend, process it, and return the results.

---

### Endpoint 1: Chart Suggestions

This endpoint is responsible for analyzing the structure of the uploaded data and suggesting the most appropriate chart types to visualize it.

*   **URL:** `/api/charts/suggestions`
*   **Method:** `POST`
*   **Request Body (JSON):**
    ```json
    {
      "data": [
        { "column1": "valueA", "column2": 10, "column3": "2023-01-01" },
        { "column1": "valueB", "column2": 20, "column3": "2023-02-01" },
        // ... more rows
      ]
    }
    ```
*   **Backend Logic:**
    1.  Receive the JSON data.
    2.  **Detect Column Types:** Analyze the columns in the dataset. For each column, determine if it is `numeric`, `date`, or `categorical` (string/text). You should implement robust logic for this, similar to the `detectColumnTypes` function in the frontend's `src/lib/chart-utils.ts` file provided below for context.
    3.  **Generate Chart Suggestions:** Based on the identified column types, recommend a list of suitable charts. Use the following rules:
        *   `line` or `area`: If there is at least one `date` or `categorical` column and at least one `numeric` column.
        *   `bar` or `pie`: If there is at least one `categorical` column and at least one `numeric` column.
        *   `scatter`: If there are at least two `numeric` columns.
        *   `radar`: If there is at least one `categorical` column and at least two `numeric` columns.
    4.  Return the results in the specified JSON format.

*   **Success Response (JSON):**
    ```json
    {
      "suggestions": ["line", "bar", "pie", "scatter", "radar", "area"],
      "columnInfo": [
        { "name": "column1", "type": "categorical" },
        { "name": "column2", "type": "numeric" },
        { "name": "column3", "type": "date" }
      ]
    }
    ```

---

### Endpoint 2: AI-Powered Insights

This endpoint uses the Google Gemini API to generate a textual analysis of the provided data.

*   **URL:** `/api/insights`
*   **Method:** `POST`
*   **Request Body (JSON):**
    ```json
    {
      "data": [
        { "month": "Jan 2023", "sales": 4000, "profit": 2400 },
        { "month": "Feb 2023", "sales": 3000, "profit": 1398 },
        // ... more rows
      ]
    }
    ```
*   **Backend Logic:**
    1.  Receive the JSON data.
    2.  Construct a detailed prompt for the Google Gemini API. The prompt should instruct the model to act as a data analyst, analyze the provided JSON data, and identify key trends, outliers, and significant findings. The output should be a concise, bulleted list formatted in Markdown.
    3.  Send the request to the Gemini API. You will need to use the `google.generativeai` Python library.
    4.  Receive the response from Gemini and format it as a single string.
    5.  Return the analysis in the specified JSON format.

*   **Success Response (JSON):**
    ```json
    {
      "insights": "- **Total Sales Analysis**: The total sales for the period is **$XX,XXX**. The highest sales were recorded in [Month], and the lowest were in [Month].\n- **Profitability Insights**: The total profit stands at **$XX,XXX**. The most profitable month was [Month]."
    }
    ```

---

### Technology Stack

*   **Language:** Python 3.x
*   **Framework:** Use either **Flask** or **FastAPI**.
*   **AI Service:** Google Gemini API (using the `google-generativeai` package).
*   **Dependencies:** Make sure to create a `requirements.txt` file listing all necessary packages.

---

### Context from Frontend Code

Here are the relevant files from the Next.js frontend to give you context on how the backend will be used.

**1. Dashboard Page (`src/app/dashboard/page.tsx`):** This file shows how the API calls are made.

```typescript
// Key functions showing API interaction
const fetchChartSuggestions = React.useCallback(async (data: any[]) => {
  // ...
  const response = await fetch('/api/charts/suggestions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  });
  const result: ChartSuggestionResponse = await response.json();
  setChartSuggestions(result.suggestions);
  setColumnInfo(result.columnInfo);
  // ...
}, [toast]);

// In the AIInsights component, a similar call is made:
const response = await fetch('/api/insights', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ data }),
});
```

**2. Chart Utils (`src/lib/chart-utils.ts`):** This shows the data structures your backend should return.

```typescript
export type ColumnType = 'numeric' | 'date' | 'categorical';

export interface ColumnInfo {
  name: string;
  type: ColumnType;
}
```

**3. Placeholder API Routes:** These are the Next.js files that will be modified to call your Python backend. You don't need to write these, but they show the "bridge" between the frontend and your new Python service.

*   `src/app/api/charts/suggestions/route.ts`
*   `src/app/api/insights/route.ts`

Your final deliverable should be a complete Python application (e.g., `app.py` or `main.py`) with a `requirements.txt` file, ready to be run as a standalone service.
