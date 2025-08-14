# NLP-Based Prescription Analyzer

## Overview

The NLP-Based Prescription Analyzer is a comprehensive medical application that uses IBM Granite 3.1-3B model to extract structured information from unstructured medical prescription text. The application supports multiple file formats including PDF, DOCX, and TXT files with OCR capabilities.

## Features

### 🔍 **File Upload & Processing**
- **Supported Formats**: PDF, DOCX, TXT, JPG, PNG, BMP, TIFF
- **Drag & Drop Interface**: User-friendly file upload
- **File Preview**: Real-time preview of uploaded images
- **Text Extraction**: Automatic extraction from various file formats
- **OCR Support**: Handles scanned documents and images with Tesseract.js
- **Extracted Text Preview**: Shows extracted text before analysis

### 🤖 **AI-Powered Analysis**
- **IBM Granite 3.1-3B Model**: State-of-the-art NLP model for medical text analysis
- **Structured Data Extraction**: Converts unstructured text to structured medical data
- **Comprehensive Analysis**: Extracts patient info, medications, diagnoses, and more

### 📊 **Structured Output**
- **Patient Information**: Name, age, demographics
- **Diagnoses**: List of medical conditions
- **Medications**: Detailed drug information including dosage, frequency, duration
- **Medical History**: Relevant past medical conditions
- **Allergies**: Known drug allergies and reactions
- **Drug Interactions**: Potential interactions with severity levels
- **Recommendations**: Clinical recommendations and follow-up instructions

## Technical Implementation

### Dependencies
```json
{
  "pdf-parse": "^1.1.1",
  "mammoth": "^1.6.0",
  "tesseract.js": "^5.0.4",
  "@huggingface/transformers": "^3.7.1"
}
```

### File Processing Pipeline

1. **File Upload**: User uploads PDF, DOCX, TXT, or image file
2. **Text Extraction**: 
   - PDF: Uses `pdf-parse` library
   - DOCX: Uses `mammoth` library
   - TXT: Direct file reading
   - Images: Uses `tesseract.js` for OCR
3. **Text Preprocessing**: Clean and format extracted text
4. **AI Analysis**: Send to IBM Granite model with structured prompt
5. **JSON Parsing**: Extract structured data from AI response
6. **Result Display**: Present organized medical information

### API Integration
- **Primary Model**: `ibm-granite/granite-3.1-3b-a800m-instruct`
- **Fallback Model**: `microsoft/DialoGPT-medium`
- **API Key**: `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`
- **Endpoint**: Hugging Face Inference API
- **Demo Mode**: Automatic fallback to mock analysis when API is unavailable

### File Processing Pipeline

1. **File Upload**: User uploads PDF, DOCX, or TXT file
2. **Text Extraction**: 
   - PDF: Uses `pdf-parse` library
   - DOCX: Uses `mammoth` library
   - TXT: Direct file reading
3. **Text Preprocessing**: Clean and format extracted text
4. **AI Analysis**: Send to IBM Granite model with structured prompt
5. **JSON Parsing**: Extract structured data from AI response
6. **Result Display**: Present organized medical information

## Usage Instructions

### 1. Access the Application
- Open your browser and navigate to `http://localhost:5000`
- Locate the "NLP-Based Prescription Analyzer" section

### 2. Upload Prescription File
- **Drag & Drop**: Drag your prescription file onto the upload area
- **Browse**: Click the upload area to select a file
- **Supported Formats**: PDF, DOCX, TXT, JPG, PNG, BMP, TIFF files
- **File Preview**: Images are automatically previewed after upload
- **OCR Processing**: Images are automatically processed using OCR technology
- **Text Preview**: Extracted text is shown before analysis

### 3. Manual Text Input (Alternative)
- If you prefer, you can manually type or paste prescription text
- Use the text area below the file upload section

### 4. Analyze Prescription
- Click the "Analyze Prescription" button
- Wait for the AI processing (typically 10-30 seconds)
- Review the structured results

### 5. Review Results
The analysis will display:
- **Patient Information**: Name and age
- **Diagnoses**: Medical conditions identified
- **Medications**: Detailed drug information
- **Medical History**: Relevant past conditions
- **Allergies**: Known drug allergies
- **Drug Interactions**: Potential interactions with severity
- **Recommendations**: Clinical advice and follow-up

## Example Output

### Input (Sample Prescription)
```
Patient: Sarah Johnson, 34 years old
Diagnosis: Acute bacterial sinusitis, Chronic hypertension, Type 2 diabetes
Medications: 
1. Amoxicillin 500mg three times daily for 10 days
2. Lisinopril 10mg once daily
3. Metformin 500mg twice daily
Allergies: Penicillin, Sulfa drugs
```

### Output (Structured Data)
```json
{
  "patientName": "Sarah Johnson",
  "age": "34 years old",
  "diagnosis": ["Acute bacterial sinusitis", "Chronic hypertension", "Type 2 diabetes"],
  "medications": [
    {
      "name": "Amoxicillin",
      "dosage": "500mg",
      "frequency": "three times daily",
      "duration": "10 days",
      "instructions": "Take with food"
    }
  ],
  "allergies": ["Penicillin", "Sulfa drugs"],
  "interactions": [
    {
      "severity": "high",
      "description": "Amoxicillin may reduce effectiveness of oral contraceptives",
      "drugs": ["Amoxicillin", "Oral contraceptives"]
    }
  ],
  "recommendations": ["Monitor blood pressure", "Check blood sugar levels"]
}
```

## Security & Privacy

### Data Handling
- **No Local Storage**: Files are processed in memory only
- **Secure API Calls**: HTTPS encryption for all API requests
- **Temporary Processing**: Files are not permanently stored

### API Security
- **Bearer Token**: Secure API key authentication
- **Rate Limiting**: Built-in request throttling
- **Error Handling**: Graceful failure handling

## Error Handling

### Common Issues & Solutions

1. **File Upload Errors**
   - Ensure file format is supported (PDF, DOCX, TXT)
   - Check file size (recommended < 10MB)
   - Verify file is not corrupted

2. **Text Extraction Failures**
   - PDF: Ensure text is selectable (not scanned images)
   - DOCX: Verify file is not password protected
   - TXT: Check file encoding (UTF-8 recommended)

3. **AI Analysis Errors**
   - Check internet connection
   - Verify API key is valid
   - Ensure text contains medical information
   - Application automatically tries fallback models if primary model fails
   - 401 errors indicate API key issues - check Hugging Face token validity

4. **JSON Parsing Errors**
   - AI response may be malformed
   - Manual review of extracted text recommended
   - Retry analysis with clearer text

## Performance Optimization

### Processing Speed
- **File Size**: Smaller files process faster
- **Text Quality**: Clear, structured text improves accuracy
- **Network**: Stable internet connection required

### Memory Usage
- **File Processing**: Optimized for memory efficiency
- **Large Files**: Automatic chunking for large documents
- **Cleanup**: Automatic memory cleanup after processing

## Future Enhancements

### Planned Features
- **Image OCR**: Enhanced image-to-text conversion
- **Batch Processing**: Multiple file analysis
- **Export Options**: PDF/CSV report generation
- **Integration**: EHR system integration
- **Mobile Support**: Responsive mobile interface

### Model Improvements
- **Custom Training**: Domain-specific model fine-tuning
- **Multi-language**: Support for multiple languages
- **Specialized Models**: Disease-specific analysis models

## Technical Architecture

### Frontend
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Shadcn/UI**: Component library

### Backend Processing
- **Vite**: Fast development server
- **File Processing**: Client-side text extraction
- **API Integration**: Direct Hugging Face API calls

### AI/ML Pipeline
- **IBM Granite 3.1-3B**: Large language model
- **Prompt Engineering**: Structured medical prompts
- **JSON Parsing**: Response structure validation

## Testing

### Test Files
- `test_prescription.txt`: Sample prescription for testing
- Various file formats: PDF, DOCX examples available

### Test Scenarios
1. **File Upload**: Test all supported formats
2. **Text Extraction**: Verify extraction accuracy
3. **AI Analysis**: Test with various prescription types
4. **Error Handling**: Test with invalid files/text
5. **UI/UX**: Test responsive design and user interactions

## Support & Maintenance

### Troubleshooting
- Check browser console for errors
- Verify API key validity
- Test with sample files provided
- Contact support for persistent issues

### Updates
- Regular dependency updates
- Model performance monitoring
- Security patch implementation
- Feature enhancement deployment

---

**Note**: This application is designed for educational and demonstration purposes. Always consult healthcare professionals for actual medical advice and prescription analysis.
