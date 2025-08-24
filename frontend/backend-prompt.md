# Prompt for Building the Python Backend for Chartly

## Persona

You are an expert Python backend developer specializing in creating robust, scalable, and efficient APIs for data-driven web applications. Your code is clean, well-documented, and production-ready.

---

## Project Overview & Goal

You are tasked with building the Python backend for a web application called "Chartly." The frontend, built with Next.js, is **already complete**. It allows users to upload data files (CSV, XLSX, JSON) and view an interactive, Power BI-style dashboard.

Your **sole responsibility** is to create a standalone Python web service that will handle all data processing, chart recommendations, and AI-powered analysis. The Next.js frontend will communicate with your Python service via the API endpoints you create.

---

## Core Task

Create a Python web service using **FastAPI** that exposes two API endpoints. This service will receive data from the Next.js frontend, process it, and return JSON responses according to the strict contracts defined below.

---

### Endpoint 1: Chart Suggestions

This endpoint analyzes the structure of an uploaded dataset and suggests appropriate chart types.

- **URL:** `/api/charts/suggestions`
- **Method:** `POST`
- **Request Body Contract (JSON):**
  ```json
  {
    "data": [
      { "column1": "valueA", "column2": 10, "column3": "2023-01-01" },
      { "column1": "valueB", "column2": 20, "column3": "2023-02-01" },
      // ... more rows
    ]
  }
  ```

- **Backend Logic (Step-by-Step):**
    1.  **Receive and Validate:** Accept the JSON payload. Ensure the `data` key exists and is a non-empty list of objects. If not, return a 400 Bad Request error.
    2.  **Detect Column Types:** For each column in the dataset, you must implement a robust function to determine its data type. Classify each column as one of `numeric`, `date`, or `categorical`.
        - A column is `numeric` if over 80% of its non-null values are numbers (integers or floats).
        - A column is `date` if over 80% of its non-null string values can be successfully parsed as a date.
        - Otherwise, a column is `categorical`.
    3.  **Generate Chart Suggestions:** Based on the array of identified column types, recommend a list of suitable charts using these specific rules:
        - `line` or `area`: Requires at least one `date` OR `categorical` column, AND at least one `numeric` column.
        - `bar` or `pie`: Requires at least one `categorical` column AND at least one `numeric` column.
        - `scatter`: Requires at least two `numeric` columns.
        - `radar`: Requires at least one `categorical` column AND at least two `numeric` columns.
    4.  **Construct and Return Response:** Return a 200 OK response with a JSON body matching the `Success Response Contract` exactly.

- **Success Response Contract (JSON):**
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
- **Error Response Contract (JSON):**
  ```json
  // Status: 400 Bad Request
  { "detail": "Invalid data format. 'data' must be a non-empty array." }
  ```

---

### Endpoint 2: AI-Powered Insights

This endpoint uses the Google Gemini API to generate a textual analysis of the provided data.

- **URL:** `/api/insights`
- **Method:** `POST`
- **Environment Variable:** You **must** retrieve your Google Gemini API key from an environment variable named `GEMINI_API_KEY`. Do not hardcode the key.

- **Request Body Contract (JSON):**
  ```json
  {
    "data": [
      { "month": "Jan 2023", "sales": 4000, "profit": 2400 },
      { "month": "Feb 2023", "sales": 3000, "profit": 1398 },
      // ... more rows
    ]
  }
  ```

- **Backend Logic (Step-by-Step):**
    1.  **Receive and Validate:** Accept the JSON payload. Ensure the `data` key exists and is a non-empty list. If not, return a 400 Bad Request error.
    2.  **Construct a Detailed Prompt:** Create a sophisticated prompt for the Google Gemini API.
        - **Persona:** "You are an expert data analyst."
        - **Task:** "Analyze the following JSON data and identify key trends, significant outliers, and actionable business insights."
        - **Context:** "The data represents [e.g., monthly sales performance, user metrics, etc. - infer from column names]."
        - **Formatting Rules:** "Your output **must** be a concise, bulleted list formatted in **Markdown**. Use bold (`**`) for emphasis on key metrics and findings. Do not include a title or any introductory text."
        - **Data:** Convert the incoming JSON data to a clean, stringified format to include in the prompt.
    3.  **Call Gemini API:** Send the request to the Gemini API using the `google-generativeai` Python library. Implement error handling for the API call (e.g., if the API key is invalid or the service is unavailable).
    4.  **Format and Return:** Receive the response from Gemini, ensure it's a single string, and return it in a JSON object.

- **Success Response Contract (JSON):**
  ```json
  {
    "insights": "- **Sales Trend**: Sales show a consistent upward trend, peaking in [Month] with **$XX,XXX**.\n- **Profitability Anomaly**: A significant profitability spike occurred in [Month], despite moderate sales, suggesting a high-margin product sale."
  }
  ```
- **Error Response Contract (JSON):**
  ```json
  // Status: 500 Internal Server Error
  { "detail": "Failed to generate insights from AI service." }
  ```

---

### Technology & Deliverables

1.  **Framework:** You **must** use **FastAPI**.
2.  **AI Library:** You **must** use `google-generativeai` for interacting with the Gemini API.
3.  **Dependencies:** Create a `requirements.txt` file listing all necessary packages (e.g., `fastapi`, `uvicorn`, `python-dotenv`, `google-generativeai`).
4.  **Main File:** The entire application logic should be contained within a single Python file (e.g., `main.py`).
5.  **CORS:** Configure CORS (Cross-Origin Resource Sharing) to allow requests from the Next.js frontend, which runs on a different port (e.g., `http://localhost:9002`).

---

### Context from Frontend (For Your Reference Only)

You do not need to write any frontend code. The following snippets show how your API will be consumed.

**API Call for Chart Suggestions (`/dashboard/page.tsx`):**
```typescript
const response = await fetch('http://localhost:8000/api/charts/suggestions', { // Note: URL will point to your Python service
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ data }),
});
const result = await response.json();
// result.suggestions -> ['bar', 'line', ...]
// result.columnInfo -> [{ name: 'sales', type: 'numeric' }, ...]
```

**Data Structures (`/lib/chart-utils.ts`):**
```typescript
export type ColumnType = 'numeric' | 'date' | 'categorical';
export interface ColumnInfo {
  name: string;
  type: ColumnType;
}
```

Your final deliverable is a complete, runnable FastAPI application with a `requirements.txt` file.