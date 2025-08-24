import os
import json
import logging
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import google.generativeai as genai
from dotenv import load_dotenv
import uvicorn
# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Chartly Backend",
    description="AI-powered data analysis and chart generation service",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Google Gemini AI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    logger.warning("GEMINI_API_KEY not found in environment variables")
else:
    genai.configure(api_key=GEMINI_API_KEY)

# Pydantic models for request/response validation
class DataRequest(BaseModel):
    data: List[Dict[str, Any]]

class ChartSuggestion(BaseModel):
    chartType: str
    title: str
    description: str
    xAxis: Optional[str] = None
    yAxis: Optional[List[str]] = None
    nameKey: Optional[str] = None
    valueKey: Optional[str] = None
    categoryKey: Optional[str] = None

class ColumnInfo(BaseModel):
    name: str
    type: str

class ChartsResponse(BaseModel):
    suggestions: List[Dict[str, Any]]
    columnInfo: List[ColumnInfo]
    processedData: Optional[List[Dict[str, Any]]] = None
    originalRowCount: int
    processedRowCount: int

class InsightsResponse(BaseModel):
    insights: str

def preprocess_data(data: List[Dict[str, Any]]) -> pd.DataFrame:
    """
    Comprehensive data preprocessing pipeline for messy real-world data.
    
    Args:
        data: List of dictionaries representing raw data
        
    Returns:
        Cleaned and normalized Pandas DataFrame
    """
    if not data:
        raise ValueError("Data is empty")
    
    # Convert to DataFrame
    df = pd.DataFrame(data)
    logger.info(f"Initial DataFrame shape: {df.shape}")
    
    # Remove columns with >60% missing values
    missing_threshold = 0.6
    missing_ratios = df.isnull().sum() / len(df)
    cols_to_drop = missing_ratios[missing_ratios > missing_threshold].index.tolist()
    
    if cols_to_drop:
        logger.info(f"Dropping columns with >60% missing values: {cols_to_drop}")
        df = df.drop(columns=cols_to_drop)
    
    # Handle missing values for remaining columns
    for col in df.columns:
        if df[col].isnull().sum() > 0:
            # Try to convert to numeric to check if mostly numeric
            numeric_col = pd.to_numeric(df[col], errors='coerce')
            numeric_ratio = numeric_col.notna().sum() / len(df[col].dropna())
            
            if numeric_ratio > 0.7:  # Mostly numeric
                df[col] = numeric_col.fillna(numeric_col.mean())
            else:
                # Fill with mode for categorical/text data
                mode_value = df[col].mode()
                if not mode_value.empty:
                    df[col] = df[col].fillna(mode_value.iloc[0])
                else:
                    df[col] = df[col].fillna("Unknown")
    
    # Type inference and coercion
    for col in df.columns:
        # Try numeric conversion
        numeric_col = pd.to_numeric(df[col], errors='coerce')
        numeric_ratio = numeric_col.notna().sum() / len(df) if len(df) > 0 else 0
        
        if numeric_ratio > 0.9:  # >90% numeric
            df[col] = numeric_col
            # Convert to int if all values are whole numbers
            if df[col].notna().all() and (df[col] == df[col].astype(int)).all():
                df[col] = df[col].astype(int)
        else:
            # Try datetime conversion
            try:
                datetime_col = pd.to_datetime(df[col], errors='coerce', infer_datetime_format=True)
                if datetime_col.notna().sum() / len(df) > 0.7:  # >70% valid dates
                    df[col] = datetime_col
                    continue
            except:
                pass
            
            # Check if should be categorical
            unique_ratio = df[col].nunique() / len(df) if len(df) > 0 else 0
            if unique_ratio < 0.1 and df[col].nunique() < 50:  # Low unique ratio and reasonable unique count
                df[col] = df[col].astype('category')
    
    # Remove duplicate rows
    initial_rows = len(df)
    df = df.drop_duplicates()
    if len(df) < initial_rows:
        logger.info(f"Removed {initial_rows - len(df)} duplicate rows")
    
    logger.info(f"Final DataFrame shape: {df.shape}")
    logger.info(f"Column types: {dict(df.dtypes)}")
    
    return df

def get_column_type(series: pd.Series) -> str:
    """Determine the semantic type of a pandas Series."""
    if pd.api.types.is_numeric_dtype(series):
        return "numeric"
    elif pd.api.types.is_datetime64_any_dtype(series):
        return "date"
    else:
        return "categorical"

def aggregate_data_for_visualization(df: pd.DataFrame, max_points: int = 50) -> pd.DataFrame:
    """
    Intelligently reduce data points for cleaner visualizations.
    
    Args:
        df: Input DataFrame
        max_points: Maximum number of data points to keep
        
    Returns:
        Aggregated DataFrame optimized for visualization
    """
    if len(df) <= max_points:
        return df.copy()
    
    # Find potential grouping columns (categorical with reasonable unique count)
    categorical_cols = [col for col in df.columns if get_column_type(df[col]) == "categorical" and df[col].nunique() <= 20]
    date_cols = [col for col in df.columns if get_column_type(df[col]) == "date"]
    numeric_cols = [col for col in df.columns if get_column_type(df[col]) == "numeric"]
    
    # Strategy 1: If we have date columns, aggregate by time periods
    if date_cols and numeric_cols:
        date_col = date_cols[0]
        df_copy = df.copy()
        df_copy[date_col] = pd.to_datetime(df_copy[date_col])
        
        # Determine appropriate time aggregation
        date_range = (df_copy[date_col].max() - df_copy[date_col].min()).days
        
        if date_range > 365:  # More than a year - aggregate by month
            df_copy['period'] = df_copy[date_col].dt.to_period('M')
        elif date_range > 90:  # More than 3 months - aggregate by week
            df_copy['period'] = df_copy[date_col].dt.to_period('W')
        else:  # Less than 3 months - aggregate by day
            df_copy['period'] = df_copy[date_col].dt.to_period('D')
        
        # Group by period and aggregate numeric columns
        agg_dict = {col: 'mean' for col in numeric_cols}
        if categorical_cols:
            # Keep the most frequent category for each period
            agg_dict.update({col: lambda x: x.mode().iloc[0] if not x.mode().empty else x.iloc[0] for col in categorical_cols})
        
        aggregated = df_copy.groupby('period').agg(agg_dict).reset_index()
        aggregated[date_col] = aggregated['period'].dt.start_time
        aggregated = aggregated.drop('period', axis=1)
        
        return aggregated
    
    # Strategy 2: If we have categorical columns, aggregate by categories
    elif categorical_cols and numeric_cols:
        cat_col = categorical_cols[0]
        agg_dict = {col: 'mean' for col in numeric_cols}
        
        # Add other categorical columns
        for col in categorical_cols[1:]:
            agg_dict[col] = lambda x: x.mode().iloc[0] if not x.mode().empty else x.iloc[0]
        
        aggregated = df.groupby(cat_col).agg(agg_dict).reset_index()
        return aggregated
    
    # Strategy 3: Statistical sampling for other cases
    else:
        # Use stratified sampling if possible, otherwise random sampling
        if categorical_cols:
            # Stratified sampling
            cat_col = categorical_cols[0]
            samples_per_group = max(1, max_points // df[cat_col].nunique())
            
            def sample_group(group):
                return group.sample(min(len(group), samples_per_group), random_state=42)
            
            sampled = df.groupby(cat_col, group_keys=False).apply(sample_group)
            return sampled.reset_index(drop=True)
        else:
            # Random sampling
            return df.sample(n=max_points, random_state=42).reset_index(drop=True)

def create_chart_prompt(df: pd.DataFrame) -> str:
    """Create a sophisticated prompt for chart generation with data reduction awareness."""
    # First, create a visualization-optimized version of the data
    viz_df = aggregate_data_for_visualization(df)
    
    # Analyze DataFrame schema
    schema_info = []
    for col in df.columns:
        col_type = get_column_type(df[col])
        unique_count = df[col].nunique() if col_type == "categorical" else None
        schema_info.append({
            "name": col,
            "type": col_type,
            "unique_count": unique_count
        })
    
    # Get sample data from the optimized dataset
    sample_data = viz_df.head(5).to_dict('records')
    
    data_reduction_note = ""
    if len(viz_df) < len(df):
        data_reduction_note = f"\n\nNote: The original dataset has {len(df)} rows, but for cleaner visualization, it has been intelligently aggregated to {len(viz_df)} data points. Consider this when making chart recommendations."
    
    prompt = f"""You are an expert data analyst and visualization specialist. Your task is to recommend the most insightful and visually appealing charts for a given dataset.

Dataset Information:
- Original rows: {len(df)}
- Visualization-optimized rows: {len(viz_df)}
- Columns: {len(df.columns)}{data_reduction_note}

Dataset Schema:
{json.dumps(schema_info, indent=2)}

Sample Data (from visualization-optimized dataset):
{json.dumps(sample_data, indent=2, default=str)}

Based on the provided schema and data sample, suggest a list of 4-6 diverse and meaningful charts.

**Important Guidelines for Clean Visualizations:**
- **Avoid overcrowded charts**: If the dataset is large, prefer aggregated views (e.g., monthly trends instead of daily, regional summaries instead of individual records)
- **Prioritize readability**: Choose chart types that work well with the data density
- **Use appropriate granularity**: For time series with many points, suggest period-based aggregation
- **Limit categorical displays**: For categories with many unique values, focus on top performers or meaningful groupings

**Crucially, do not suggest redundant charts.** For example, if you suggest a bar chart to show 'Sales by Region', do not also suggest a pie chart for the exact same relationship. Each chart should provide a new perspective on the data.

Prioritize clarity and insightfulness. A good recommendation might include a line chart for trends, a bar chart for comparisons, a pie chart for composition, and a scatter plot for correlations.

Generate a title and a brief, one-sentence description for each chart that explains what it shows.

Your response **MUST** be a JSON object containing a single key, `suggestions`, which is an array of chart configuration objects. **Do not output any other text or markdown.** Each object in the array must conform *exactly* to one of the following structures, depending on the `chartType`:

For Line/Area/Bar/Scatter charts:
{{"chartType": "line|area|bar|scatter", "xAxis": "column_name", "yAxis": ["column_name"], "title": "Chart Title", "description": "Brief description", "aggregated": true|false}}

For Pie charts:
{{"chartType": "pie", "nameKey": "categorical_column", "valueKey": "numeric_column", "title": "Chart Title", "description": "Brief description", "aggregated": true|false}}

For Radar charts:
{{"chartType": "radar", "categoryKey": "categorical_column", "yAxis": ["numeric_col1", "numeric_col2"], "title": "Chart Title", "description": "Brief description", "aggregated": true|false}}

Set "aggregated": true if the chart benefits from data aggregation, false otherwise.

Ensure all column names referenced in your suggestions exist in the provided schema."""
    
    return prompt

def create_insights_prompt(df: pd.DataFrame) -> str:
    """Create a sophisticated prompt for generating insights."""
    data_json = df.to_json(orient='records', default_handler=str)
    
    prompt = f"""You are a world-class data analyst. Your insights are sharp, concise, and actionable.

You will be given a dataset in JSON format. The data has been pre-cleaned. Your task is to perform a comprehensive analysis.

Analysis Steps:
- First, identify the primary measures and dimensions.
- Second, summarize the most significant trends, quantifying them where possible.
- Third, pinpoint any major anomalies or outliers.
- Fourth, identify key relationships between variables.
- Finally, derive at least two actionable business insights.

Your output **must** be a single string of **Markdown**. Use bullet points (`-`) and bold (`**`) for emphasis. Do not include a title or introduction.

Dataset:
{data_json}"""
    
    return prompt

async def call_gemini_api(prompt: str, max_retries: int = 2) -> str:
    """Call Google Gemini API with retry logic."""
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API key not configured")
    
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    for attempt in range(max_retries + 1):
        try:
            logger.info(f"Calling Gemini API (attempt {attempt + 1}/{max_retries + 1})")
            response = model.generate_content(prompt)
            
            if response.text:
                return response.text.strip()
            else:
                raise Exception("Empty response from Gemini API")
                
        except Exception as e:
            logger.error(f"Gemini API call failed (attempt {attempt + 1}): {str(e)}")
            if attempt == max_retries:
                raise HTTPException(
                    status_code=500, 
                    detail=f"Failed to get response from AI service after {max_retries + 1} attempts: {str(e)}"
                )
    
    raise HTTPException(status_code=500, detail="Unexpected error in AI service call")

@app.get("/")
async def root():
    """Health check endpoint."""
    return {"message": "Chartly Backend Service is running", "status": "healthy"}

@app.post("/api/charts/suggestions", response_model=ChartsResponse)
async def get_chart_suggestions(request: DataRequest):
    """
    Generate AI-powered chart suggestions based on the provided data.
    """
    try:
        # Validate input
        if not request.data:
            raise HTTPException(status_code=400, detail="Data cannot be empty")
        
        # Preprocess data
        df = preprocess_data(request.data)
        original_row_count = len(df)
        
        if df.empty:
            raise HTTPException(status_code=400, detail="No valid data after preprocessing")
        
        # Create visualization-optimized dataset
        viz_df = aggregate_data_for_visualization(df)
        processed_row_count = len(viz_df)
        
        # Create column info from original dataset
        column_info = [
            ColumnInfo(name=col, type=get_column_type(df[col]))
            for col in df.columns
        ]
        
        # Generate chart suggestions using AI
        prompt = create_chart_prompt(df)
        ai_response = await call_gemini_api(prompt)
        
        # Parse AI response
        try:
            # Try to parse as JSON
            suggestions_data = json.loads(ai_response)
            
            if not isinstance(suggestions_data, dict) or 'suggestions' not in suggestions_data:
                raise ValueError("Invalid response format from AI")
            
            suggestions = suggestions_data['suggestions']
            
            if not isinstance(suggestions, list):
                raise ValueError("Suggestions must be a list")
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse AI response as JSON: {ai_response}")
            # Try to extract JSON from response if it's wrapped in text
            try:
                # Look for JSON block in the response
                start = ai_response.find('{')
                end = ai_response.rfind('}') + 1
                if start != -1 and end != 0:
                    json_part = ai_response[start:end]
                    suggestions_data = json.loads(json_part)
                    suggestions = suggestions_data['suggestions']
                else:
                    raise e
            except:
                raise HTTPException(
                    status_code=500, 
                    detail="Failed to parse chart suggestions from AI response"
                )
        
        # Include processed data for charts that need aggregation
        processed_data = None
        if processed_row_count < original_row_count:
            processed_data = viz_df.to_dict('records')
        
        return ChartsResponse(
            suggestions=suggestions,
            columnInfo=column_info,
            processedData=processed_data,
            originalRowCount=original_row_count,
            processedRowCount=processed_row_count
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in chart suggestions endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

class OptimizedDataResponse(BaseModel):
    data: List[Dict[str, Any]]
    originalRowCount: int
    optimizedRowCount: int
    aggregationMethod: str

@app.post("/api/data/optimize", response_model=OptimizedDataResponse)
async def optimize_data_for_chart(request: DataRequest):
    """
    Return optimized data specifically for cleaner chart visualization.
    """
    try:
        # Validate input
        if not request.data:
            raise HTTPException(status_code=400, detail="Data cannot be empty")
        
        # Preprocess data
        df = preprocess_data(request.data)
        original_count = len(df)
        
        if df.empty:
            raise HTTPException(status_code=400, detail="No valid data after preprocessing")
        
        # Optimize for visualization
        optimized_df = aggregate_data_for_visualization(df, max_points=50)
        optimized_count = len(optimized_df)
        
        # Determine aggregation method used
        method = "none"
        if optimized_count < original_count:
            date_cols = [col for col in df.columns if get_column_type(df[col]) == "date"]
            categorical_cols = [col for col in df.columns if get_column_type(df[col]) == "categorical" and df[col].nunique() <= 20]
            
            if date_cols:
                method = "time_aggregation"
            elif categorical_cols:
                method = "categorical_aggregation"
            else:
                method = "statistical_sampling"
        
        return OptimizedDataResponse(
            data=optimized_df.to_dict('records'),
            originalRowCount=original_count,
            optimizedRowCount=optimized_count,
            aggregationMethod=method
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in data optimization endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/api/insights", response_model=InsightsResponse)
async def get_insights(request: DataRequest):
    """
    Generate AI-powered textual insights from the provided data.
    """
    try:
        # Validate input
        if not request.data:
            raise HTTPException(status_code=400, detail="Data cannot be empty")
        
        # Preprocess data
        df = preprocess_data(request.data)
        
        if df.empty:
            raise HTTPException(status_code=400, detail="No valid data after preprocessing")
        
        # Generate insights using AI
        prompt = create_insights_prompt(df)
        insights_text = await call_gemini_api(prompt)
        
        return InsightsResponse(insights=insights_text)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in insights endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)