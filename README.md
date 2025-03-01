# Gemini Data Analyzer

A powerful web application for analyzing datasets using Google's Gemini AI. Upload your data in various formats (JSON, CSV, Excel) and get AI-powered insights and visualizations.

## Features

- **Dataset Upload**: Support for JSON, CSV, and Excel files
- **Data Processing & Cleaning**: Automatic handling of missing values and data formatting
- **AI-Powered Analytics**: Leverages Gemini AI to identify trends and patterns
- **Dynamic Visualizations**: Multiple chart types including bar, line, pie, scatter plots, and more
- **Interactive Dashboard**: User-friendly interface to explore data and insights
- **Export & Share**: Download visualizations and insights

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` and add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Usage

1. Upload your dataset (JSON, CSV, or Excel format)
2. The application will process your data and generate AI insights
3. Explore different visualization types and customize the charts
4. View detailed data in the data table
5. Export or share your findings

## Technology Stack

- **Frontend**: React with TypeScript
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **File Parsing**: Papa Parse (CSV), XLSX (Excel)
- **AI Integration**: Google Generative AI (Gemini)

## License

MIT