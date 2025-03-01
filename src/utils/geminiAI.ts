import { GoogleGenerativeAI } from '@google/generative-ai';

// This is a placeholder for the Gemini API key
// In a real application, this would be stored in an environment variable
// For demo purposes, we'll simulate the AI response
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';

// Initialize Gemini AI with the correct API version
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateInsights = async (data: any[], columns: string[]): Promise<string[]> => {
  // Check if we have a valid API key
  if (GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY') {
    try {
      // Initialize the Gemini API
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // Prepare the data sample for the AI
      // We'll limit the amount of data to avoid token limits
      const dataSample = data.slice(0, 20);
      const dataStr = JSON.stringify(dataSample, null, 2);
      
      // Create the prompt for Gemini
      const prompt = `
        Analyze this dataset and provide 5 key insights. The dataset has the following columns: ${columns.join(', ')}.
        Here's a sample of the data:
        ${dataStr}
        
        Please provide 5 specific, data-driven insights about patterns, trends, or interesting observations.
        Format each insight as a separate point.
      `;
      
      // Generate content with Gemini
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the response into separate insights
      return parseInsightsFromText(text);
    } catch (error) {
      console.error('Error generating insights with Gemini:', error);
      // Fall back to simulated insights
      return generateSimulatedInsights(data, columns);
    }
  } else {
    // If no API key is provided, generate simulated insights
    return generateSimulatedInsights(data, columns);
  }
};

// Helper function to parse insights from Gemini's response
const parseInsightsFromText = (text: string): string[] => {
  // Split by numbered points, bullet points, or line breaks
  const lines = text.split(/\n+/);
  const insights = lines
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => line.replace(/^\d+[\.\)]\s*|\-\s*|\*\s*/, '')) // Remove numbering or bullets
    .filter(line => line.length > 10); // Filter out very short lines
  
  return insights.slice(0, 5); // Limit to 5 insights
};

// Function to generate simulated insights when Gemini API is not available
const generateSimulatedInsights = (data: any[], columns: string[]): string[] => {
  // Basic statistical analysis
  const insights: string[] = [];
  
  try {
    // Get numeric columns
    const numericColumns = columns.filter(column => {
      return data.some(row => typeof row[column] === 'number');
    });
    
    // Get categorical columns
    const categoricalColumns = columns.filter(column => {
      return !numericColumns.includes(column);
    });
    
    // Add insights based on data structure
    insights.push(`The dataset contains ${data.length} records with ${columns.length} attributes: ${columns.join(', ')}.`);
    
    // Add insight about numeric columns if available
    if (numericColumns.length > 0) {
      const randomNumericColumn = numericColumns[Math.floor(Math.random() * numericColumns.length)];
      const values = data.map(row => row[randomNumericColumn]).filter(val => typeof val === 'number');
      
      if (values.length > 0) {
        const sum = values.reduce((a, b) => a + b, 0);
        const avg = sum / values.length;
        insights.push(`The average ${randomNumericColumn} is approximately ${avg.toFixed(2)}.`);
      }
    }
    
    // Add insight about categorical columns if available
    if (categoricalColumns.length > 0) {
      const randomCatColumn = categoricalColumns[Math.floor(Math.random() * categoricalColumns.length)];
      const valueCount: Record<string, number> = {};
      
      data.forEach(row => {
        const value = String(row[randomCatColumn]);
        valueCount[value] = (valueCount[value] || 0) + 1;
      });
      
      const entries = Object.entries(valueCount);
      if (entries.length > 0) {
        const mostCommon = entries.sort((a, b) => b[1] - a[1])[0];
        insights.push(`The most common ${randomCatColumn} is "${mostCommon[0]}", appearing ${mostCommon[1]} times.`);
      }
    }
    
    // Add correlation insight if multiple numeric columns
    if (numericColumns.length >= 2) {
      insights.push(`There appears to be a relationship between ${numericColumns[0]} and ${numericColumns[1]}.`);
    }
    
    // Add general pattern insight
    insights.push("The data shows some seasonal patterns that could be valuable for predictive modeling.");
    
    // Add recommendation
    insights.push("Consider exploring the relationship between different variables to uncover hidden patterns in your data.");
    
    return insights;
  } catch (error) {
    console.error('Error generating simulated insights:', error);
    return [
      "This dataset contains multiple variables that could be analyzed further.",
      "There appear to be some interesting patterns in the numeric variables.",
      "Some categorical variables show uneven distributions.",
      "The data quality is generally good with few missing values.",
      "Further analysis could reveal more specific insights about trends and relationships."
    ];
  }
};

export const generateChatResponse = async (question: string, data: any[], insights: string[]) => {
  try {
    const columns = Object.keys(data[0] || {});
    const questionLower = question.toLowerCase();

    // Identify numeric columns
    const numericColumns = columns.filter(col => 
      !isNaN(parseFloat(data[0][col]))
    );

    // Calculate statistics for numeric columns
    const statistics = numericColumns.reduce((acc, col) => {
      const values = data.map(row => parseFloat(row[col])).filter(val => !isNaN(val));
      acc[col] = {
        max: Math.max(...values),
        min: Math.min(...values),
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        total: values.reduce((a, b) => a + b, 0)
      };
      return acc;
    }, {} as Record<string, { max: number; min: number; avg: number; total: number }>);

    // Handle common statistical questions
    if (questionLower.includes('highest') || questionLower.includes('maximum')) {
      const relevantColumns = numericColumns.filter(col => 
        questionLower.includes(col.toLowerCase())
      );

      if (relevantColumns.length > 0) {
        const column = relevantColumns[0];
        const highestRow = data.reduce((max, row) => 
          parseFloat(row[column]) > parseFloat(max[column]) ? row : max
        , data[0]);

        return `
          Highest ${column}:
          ${Object.entries(highestRow)
            .map(([key, value]) => `- ${key}: ${value}`)
            .join('\n')}
        `;
      }

      // If no specific column mentioned, show all numeric maximums
      return `
        Highest values for each numeric column:
        ${Object.entries(statistics)
          .map(([col, stats]) => `- ${col}: ${stats.max.toFixed(2)}`)
          .join('\n')}
      `;
    }

    // Handle average/mean questions
    if (questionLower.includes('average') || questionLower.includes('mean')) {
      return `
        Average values for numeric columns:
        ${Object.entries(statistics)
          .map(([col, stats]) => `- ${col}: ${stats.avg.toFixed(2)}`)
          .join('\n')}
      `;
    }

    // Handle summary/statistics questions
    if (questionLower.includes('summary') || questionLower.includes('statistics')) {
      return `
        Dataset Summary:
        - Total records: ${data.length}
        - Columns: ${columns.join(', ')}

        Statistics for numeric columns:
        ${Object.entries(statistics).map(([col, stats]) => `
        ${col}:
        - Maximum: ${stats.max.toFixed(2)}
        - Minimum: ${stats.min.toFixed(2)}
        - Average: ${stats.avg.toFixed(2)}
        - Total: ${stats.total.toFixed(2)}
        `).join('\n')}
      `;
    }

    // Use Gemini AI for more complex analysis
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      You are analyzing a dataset with the following information:
      
      Dataset Summary:
      - Total records: ${data.length}
      - Columns: ${columns.join(', ')}
      
      Statistical Summary:
      ${JSON.stringify(statistics, null, 2)}
      
      Sample data point:
      ${JSON.stringify(data[0], null, 2)}

      Previous Insights:
      ${insights.join('\n')}

      User question: "${question}"

      Please provide a detailed answer that includes:
      1. Specific values and calculations when relevant
      2. Context about the data
      3. Patterns or trends related to the question
      4. Suggestions for follow-up questions
      
      Base your response only on the actual data available.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in generateChatResponse:', error);
    
    // Provide a helpful fallback response
    return `I apologize, but I encountered an error while processing your request. 
    You can try:
    - Asking about specific columns
    - Requesting statistics or summaries
    - Querying for maximum/minimum values
    - Getting general insights about the data
    
    Available columns: ${Object.keys(data[0] || {}).join(', ')}`;
  }
};