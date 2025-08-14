# MedGuardian AI - NLP-Based Prescription Analyzer

## 🏥 **Project Overview**

MedGuardian AI is a comprehensive medical application that uses advanced Natural Language Processing (NLP) to extract structured information from unstructured medical prescription text. The application supports multiple file formats including PDF, DOCX, TXT, and image files with OCR capabilities.

## 🚀 **Key Features**

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

## 🛠️ **Technology Stack**

This project is built with modern web technologies:

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/UI
- **Build Tool**: Vite
- **File Processing**: pdf-parse, mammoth, tesseract.js
- **AI/ML**: IBM Granite 3.1-3B, Hugging Face API
- **Development**: Hot Module Replacement (HMR)

## 📦 **Installation & Setup**

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd MedGuardianLA

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`

## 🎯 **Usage Instructions**

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

## 🔧 **Development**

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Shadcn/UI components
│   ├── PrescriptionAnalyzer.tsx
│   ├── DrugInteractionChecker.tsx
│   └── ...
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── main.tsx           # Application entry point
```

## 🔒 **Security & Privacy**

### Data Handling
- **No Local Storage**: Files are processed in memory only
- **Secure API Calls**: HTTPS encryption for all API requests
- **Temporary Processing**: Files are not permanently stored

### API Security
- **Bearer Token**: Secure API key authentication
- **Rate Limiting**: Built-in request throttling
- **Error Handling**: Graceful failure handling

## 🐛 **Troubleshooting**

### Common Issues

1. **File Upload Errors**
   - Ensure file format is supported (PDF, DOCX, TXT, JPG, PNG, BMP, TIFF)
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

4. **Development Issues**
   - Ensure Node.js version is 16 or higher
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check browser console for detailed error messages

## 📄 **License**

This project is designed for educational and demonstration purposes. Always consult healthcare professionals for actual medical advice and prescription analysis.

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📞 **Support**

For technical support or questions:
- Check the troubleshooting section above
- Review the browser console for error messages
- Ensure all dependencies are properly installed

---

**Note**: This application is designed for educational and demonstration purposes. Always consult healthcare professionals for actual medical advice and prescription analysis.
