import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface ParseResult {
  data: any[];
  columns: string[];
}

export const parseFile = async (file: File): Promise<ParseResult> => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
  switch (fileExtension) {
    case 'csv':
      return parseCSV(file);
    case 'xlsx':
    case 'xls':
      return parseExcel(file);
    case 'json':
      return parseJSON(file);
    default:
      throw new Error(`Unsupported file format: ${fileExtension}`);
  }
};

const parseCSV = (file: File): Promise<ParseResult> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`Error parsing CSV: ${results.errors[0].message}`));
          return;
        }
        
        const data = results.data as any[];
        const columns = results.meta.fields || [];
        
        resolve({ data, columns });
      },
      error: (error) => {
        reject(new Error(`Error parsing CSV: ${error.message}`));
      }
    });
  });
};

const parseExcel = (file: File): Promise<ParseResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error('Failed to read Excel file'));
          return;
        }
        
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON with headers
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Extract column names
        const columns = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];
        
        resolve({ data: jsonData, columns });
      } catch (error: any) {
        reject(new Error(`Error parsing Excel file: ${error.message}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read Excel file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

const parseJSON = (file: File): Promise<ParseResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const jsonText = e.target?.result as string;
        if (!jsonText) {
          reject(new Error('Failed to read JSON file'));
          return;
        }
        
        const jsonData = JSON.parse(jsonText);
        
        // Handle different JSON structures
        let data: any[] = [];
        
        if (Array.isArray(jsonData)) {
          data = jsonData;
        } else if (typeof jsonData === 'object' && jsonData !== null) {
          // If it's an object with a data property that's an array
          if (Array.isArray(jsonData.data)) {
            data = jsonData.data;
          } else {
            // If it's just an object, wrap it in an array
            data = [jsonData];
          }
        }
        
        // Extract column names from the first item
        const columns = data.length > 0 ? Object.keys(data[0]) : [];
        
        resolve({ data, columns });
      } catch (error: any) {
        reject(new Error(`Error parsing JSON file: ${error.message}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read JSON file'));
    };
    
    reader.readAsText(file);
  });
};

// Helper function to clean data
export const cleanData = (data: any[]): any[] => {
  return data.map(row => {
    const cleanedRow: Record<string, any> = {};
    
    Object.entries(row).forEach(([key, value]) => {
      // Handle missing values
      if (value === undefined || value === null || value === '') {
        cleanedRow[key] = null;
        return;
      }
      
      // Try to convert numeric strings to numbers
      if (typeof value === 'string' && !isNaN(Number(value))) {
        cleanedRow[key] = Number(value);
      } else {
        cleanedRow[key] = value;
      }
    });
    
    return cleanedRow;
  });
};