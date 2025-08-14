import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Upload, FileText, Brain, AlertTriangle, CheckCircle, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PrescriptionData {
  patientName: string;
  age: string;
  diagnosis: string[];
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  medicalHistory: string[];
  allergies: string[];
  interactions: Array<{
    severity: 'high' | 'medium' | 'low';
    description: string;
    drugs: string[];
  }>;
  recommendations: string[];
}

export function PrescriptionAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [analysisResult, setAnalysisResult] = useState<PrescriptionData | null>(null);
  const [manualText, setManualText] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Cleanup preview URL on unmount
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const IBM_GRANITE_API_KEY = "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";
  const IBM_GRANITE_MODEL = "ibm-granite/granite-3.1-3b-a800m-instruct";
  const FALLBACK_MODEL = "microsoft/DialoGPT-medium"; // Fallback model if Granite fails

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsAnalyzing(true);

    // Create preview URL for images
    if (file.type.startsWith('image/')) {
      setIsPreviewLoading(true);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setShowPreview(true);
    } else {
      setShowPreview(false);
      setPreviewUrl("");
    }

    try {
      let text = "";
      const fileType = file.type;
      const fileName = file.name.toLowerCase();

      if (fileType === "text/plain" || fileName.endsWith('.txt')) {
        text = await extractTextFromTxt(file);
      } else if (fileType === "application/pdf" || fileName.endsWith('.pdf')) {
        text = await extractTextFromPdf(file);
      } else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || fileName.endsWith('.docx')) {
        text = await extractTextFromDocx(file);
      } else if (fileType.startsWith('image/') || fileName.match(/\.(jpg|jpeg|png|bmp|tiff)$/i)) {
        text = await extractTextFromImage(file);
      } else {
        throw new Error("Unsupported file format. Please upload PDF, DOCX, TXT, or image files (JPG, PNG, BMP, TIFF).");
      }

      setExtractedText(text);
      setManualText(text);
      toast({
        title: "File processed successfully",
        description: `Extracted ${text.length} characters from ${file.name}`,
      });
    } catch (error) {
      console.error("File processing error:", error);
      toast({
        title: "File processing failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setIsPreviewLoading(false);
    }
  };

  const extractTextFromTxt = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const extractTextFromPdf = async (file: File): Promise<string> => {
    try {
      const pdfParse = await import('pdf-parse');
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const result = await pdfParse.default(data);
      return result.text;
    } catch (error) {
      console.error('PDF parsing error:', error);
      throw new Error('Failed to parse PDF file. Please ensure it contains readable text.');
    }
  };

  const extractTextFromDocx = async (file: File): Promise<string> => {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const extractTextFromImage = async (file: File): Promise<string> => {
    try {
      const Tesseract = await import('tesseract.js');
      
      const result = await Tesseract.recognize(
        file,
        'eng',
        {
          logger: m => console.log(m)
        }
      );
      
      return result.data.text;
    } catch (error) {
      console.error('Image OCR error:', error);
      throw new Error('Failed to extract text from image. Please ensure the image is clear and contains readable text.');
    }
  };

  const performMockAnalysis = (text: string): PrescriptionData => {
    // Extract basic information using regex patterns
    const patientNameMatch = text.match(/Patient[:\s]+([^,\n]+)/i) || text.match(/Name[:\s]+([^,\n]+)/i);
    const ageMatch = text.match(/(\d+)\s*(?:years?\s*old|y\.?o\.?)/i);
    const diagnosisMatches = text.match(/Diagnosis[:\s]+([^.\n]+)/gi) || text.match(/- ([^.\n]+)/g);
    const medicationMatches = text.match(/(\d+\.\s*)?([A-Za-z]+)\s+(\d+mg)/gi);
    const allergyMatches = text.match(/Allergies?[:\s]+([^.\n]+)/gi);

    return {
      patientName: patientNameMatch ? patientNameMatch[1].trim() : "Extracted from text",
      age: ageMatch ? `${ageMatch[1]} years old` : "Not specified",
      diagnosis: diagnosisMatches ? 
        diagnosisMatches.map(d => d.replace(/^[-:\s]+/, '').trim()).filter(d => d.length > 0) : 
        ["Analysis completed"],
      medications: medicationMatches ? 
        medicationMatches.map((med, index) => ({
          name: med.replace(/\d+mg/i, '').trim(),
          dosage: med.match(/\d+mg/i)?.[0] || "As prescribed",
          frequency: "As directed",
          duration: "As prescribed",
          instructions: "Follow doctor's instructions"
        })) : 
        [{
          name: "Medications detected",
          dosage: "Various",
          frequency: "As prescribed",
          duration: "As directed",
          instructions: "Follow medical advice"
        }],
      medicalHistory: ["Medical history extracted from text"],
      allergies: allergyMatches ? 
        allergyMatches.map(a => a.replace(/^Allergies?[:\s]+/, '').trim()) : 
        ["None specified"],
      interactions: [{
        severity: "medium" as const,
        description: "Standard drug interaction monitoring recommended",
        drugs: ["All prescribed medications"]
      }],
      recommendations: [
        "Follow prescribed dosage instructions",
        "Monitor for any adverse reactions",
        "Consult healthcare provider for questions",
        "Keep follow-up appointments"
      ]
    };
  };

  const analyzePrescription = async () => {
    if (!manualText.trim()) {
      toast({
        title: "No text to analyze",
        description: "Please upload a file or enter prescription text manually",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const prompt = `Analyze the following medical prescription and extract structured information. Return a JSON object with the following structure:

{
  "patientName": "extracted patient name",
  "age": "extracted age",
  "diagnosis": ["list of diagnoses"],
  "medications": [
    {
      "name": "medication name",
      "dosage": "dosage information",
      "frequency": "frequency of administration",
      "duration": "duration of treatment",
      "instructions": "special instructions"
    }
  ],
  "medicalHistory": ["relevant medical history"],
  "allergies": ["known allergies"],
  "interactions": [
    {
      "severity": "high/medium/low",
      "description": "interaction description",
      "drugs": ["drugs involved"]
    }
  ],
  "recommendations": ["clinical recommendations"]
}

Prescription text:
${manualText}

Provide only the JSON response without any additional text.`;

      // Try IBM Granite model first
      let response = await fetch(`https://api-inference.huggingface.co/models/${IBM_GRANITE_MODEL}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${IBM_GRANITE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 2048,
            temperature: 0.1,
            top_p: 0.9,
            do_sample: true,
          },
        }),
      });

      // If IBM Granite fails, try fallback model
      if (!response.ok) {
        console.warn(`IBM Granite API failed with status ${response.status}, trying fallback model...`);
        
        response = await fetch(`https://api-inference.huggingface.co/models/${FALLBACK_MODEL}`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${IBM_GRANITE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_new_tokens: 1024,
              temperature: 0.7,
              top_p: 0.9,
              do_sample: true,
            },
          }),
        });

        if (!response.ok) {
          console.warn(`All API models failed. Last status: ${response.status}. Using mock analysis for demonstration.`);
          
          // Mock analysis for demonstration when API fails
          const mockResult = performMockAnalysis(manualText);
          setAnalysisResult(mockResult);
          toast({
            title: "Demo Mode",
            description: "API unavailable. Showing mock analysis results for demonstration.",
          });
          return;
        }
      }

      const data = await response.json();
      let result: PrescriptionData;

      try {
        // Extract JSON from the response
        const jsonMatch = data[0]?.generated_text?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No valid JSON found in response");
        }
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        // Fallback: create a basic structure
        result = {
          patientName: "Unable to extract",
          age: "Unable to extract",
          diagnosis: ["Unable to extract"],
          medications: [],
          medicalHistory: ["Unable to extract"],
          allergies: ["Unable to extract"],
          interactions: [],
          recommendations: ["Please review manually"]
        };
      }

      setAnalysisResult(result);
      toast({
        title: "Analysis completed",
        description: "Prescription has been analyzed successfully",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (fileInputRef.current) {
        fileInputRef.current.files = files;
        handleFileUpload({ target: { files } } as any);
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-blue-600" />
          <CardTitle>NLP-Based Prescription Analyzer</CardTitle>
        </div>
        <CardDescription>
          Extract structured drug information from unstructured medical text using IBM Granite AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Section */}
        <div className="space-y-4">
          <Label htmlFor="file-upload">Upload Prescription File</Label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              Drag and drop a PDF, DOCX, TXT, or image file here, or click to browse
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: PDF, DOCX, TXT, JPG, PNG, BMP, TIFF
            </p>
            <Input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              accept=".pdf,.docx,.txt,.jpg,.jpeg,.png,.bmp,.tiff"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          {uploadedFile && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-green-600">
                {uploadedFile.type.startsWith('image/') ? (
                  <Image className="h-4 w-4" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                <span>{uploadedFile.name}</span>
              </div>
              
              {/* File Preview */}
              {showPreview && (
                <div className="border rounded-lg p-3 bg-gray-50">
                  <h4 className="text-sm font-medium mb-2">File Preview:</h4>
                  <div className="max-w-md mx-auto">
                    {isPreviewLoading ? (
                      <div className="flex items-center justify-center h-32">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                        <span className="ml-2 text-sm text-gray-600">Loading preview...</span>
                      </div>
                    ) : previewUrl ? (
                      <img 
                        src={previewUrl} 
                        alt="File preview" 
                        className="w-full h-auto rounded border shadow-sm"
                        style={{ maxHeight: '300px', objectFit: 'contain' }}
                      />
                    ) : null}
                  </div>
                </div>
              )}
              
              {/* Extracted Text Preview */}
              {extractedText && (
                <div className="border rounded-lg p-3 bg-blue-50">
                  <h4 className="text-sm font-medium mb-2 text-blue-900">Extracted Text Preview:</h4>
                  <div className="text-xs text-gray-700 bg-white p-2 rounded border max-h-32 overflow-y-auto">
                    {extractedText.length > 200 
                      ? `${extractedText.substring(0, 200)}...` 
                      : extractedText
                    }
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Text Input Section */}
        <div className="space-y-2">
          <Label htmlFor="prescription-text">Prescription or Medical Text</Label>
          <Textarea
            id="prescription-text"
            placeholder="Enter prescription text here... e.g., Patient: John Doe, 45 years old Diagnosis: Bacterial infection, chronic pain Medications: 1. Amoxicillin 500mg three times daily for 7 days 2. Ibuprofen 200mg as needed for pain 3. Take with food Medical history: Hypertension, Type 2 diabetes"
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            className="min-h-[120px]"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={analyzePrescription}
            disabled={isAnalyzing || !manualText.trim()}
            className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Analyze Prescription
              </>
            )}
          </Button>
          
          <Button
            onClick={() => {
              setUploadedFile(null);
              setExtractedText("");
              setManualText("");
              setAnalysisResult(null);
              setShowPreview(false);
              if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl("");
              }
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
            variant="outline"
            className="px-4"
          >
            Clear
          </Button>
        </div>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-semibold">Analysis Results</h3>
            
            {/* Patient Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Patient Name</Label>
                <p className="text-sm bg-gray-50 p-2 rounded">{analysisResult.patientName}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Age</Label>
                <p className="text-sm bg-gray-50 p-2 rounded">{analysisResult.age}</p>
              </div>
            </div>

            {/* Diagnosis */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Diagnosis</Label>
              <div className="flex flex-wrap gap-2">
                {analysisResult.diagnosis.map((diag, index) => (
                  <Badge key={index} variant="secondary">{diag}</Badge>
                ))}
              </div>
            </div>

            {/* Medications */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Medications</Label>
              <div className="space-y-3">
                {analysisResult.medications.map((med, index) => (
                  <div key={index} className="border rounded-lg p-3 bg-blue-50">
                    <div className="font-medium text-blue-900">{med.name}</div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div><strong>Dosage:</strong> {med.dosage}</div>
                      <div><strong>Frequency:</strong> {med.frequency}</div>
                      <div><strong>Duration:</strong> {med.duration}</div>
                      {med.instructions && (
                        <div><strong>Instructions:</strong> {med.instructions}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Medical History */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Medical History</Label>
              <div className="flex flex-wrap gap-2">
                {analysisResult.medicalHistory.map((history, index) => (
                  <Badge key={index} variant="outline">{history}</Badge>
                ))}
              </div>
            </div>

            {/* Allergies */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Allergies</Label>
              <div className="flex flex-wrap gap-2">
                {analysisResult.allergies.map((allergy, index) => (
                  <Badge key={index} variant="destructive">{allergy}</Badge>
                ))}
              </div>
            </div>

            {/* Drug Interactions */}
            {analysisResult.interactions.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Drug Interactions</Label>
                <div className="space-y-2">
                  {analysisResult.interactions.map((interaction, index) => (
                    <div key={index} className="border rounded-lg p-3 bg-yellow-50">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <Badge variant={interaction.severity === 'high' ? 'destructive' : interaction.severity === 'medium' ? 'secondary' : 'outline'}>
                          {interaction.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm mt-2">{interaction.description}</p>
                      <div className="text-xs text-gray-600 mt-1">
                        Drugs: {interaction.drugs.join(', ')}
                      </div>
                    </div>
                          ))}
                        </div>
                      </div>
                    )}

            {/* Recommendations */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Recommendations</Label>
              <div className="space-y-2">
                {analysisResult.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t">
          <span>Powered by IBM Granite 3.1-3B (Hugging Face) • Demo Mode Available</span>
          <span>AI-Powered Medical Analysis</span>
        </div>
      </CardContent>
    </Card>
  );
}