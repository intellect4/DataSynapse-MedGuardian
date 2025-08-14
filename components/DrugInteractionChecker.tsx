import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: "high" | "medium" | "low";
  description: string;
}

const mockInteractions: DrugInteraction[] = [
  {
    drug1: "warfarin",
    drug2: "aspirin",
    severity: "high",
    description: "Increased risk of bleeding when taken together"
  },
  {
    drug1: "metformin",
    drug2: "alcohol",
    severity: "medium",
    description: "May increase risk of lactic acidosis"
  }
];

export const DrugInteractionChecker = () => {
  const [drugs, setDrugs] = useState<string[]>([""]);
  const [interactions, setInteractions] = useState<DrugInteraction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const addDrugField = () => {
    setDrugs([...drugs, ""]);
  };

  const removeDrugField = (index: number) => {
    if (drugs.length > 1) {
      setDrugs(drugs.filter((_, i) => i !== index));
    }
  };

  const updateDrug = (index: number, value: string) => {
    const newDrugs = [...drugs];
    newDrugs[index] = value;
    setDrugs(newDrugs);
  };

  const checkInteractions = async () => {
    setIsAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      const filteredDrugs = drugs.filter(drug => drug.trim() !== "");
      const foundInteractions = mockInteractions.filter(interaction => 
        filteredDrugs.some(drug => 
          drug.toLowerCase().includes(interaction.drug1.toLowerCase()) ||
          drug.toLowerCase().includes(interaction.drug2.toLowerCase())
        )
      );
      
      setInteractions(foundInteractions);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: `Found ${foundInteractions.length} potential interactions`,
      });
    }, 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "warning";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          Drug Interaction Checker
        </CardTitle>
        <CardDescription>
          Enter multiple medications to check for potential interactions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Medications</Label>
          {drugs.map((drug, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder={`Medication ${index + 1}`}
                value={drug}
                onChange={(e) => updateDrug(index, e.target.value)}
                className="flex-1"
              />
              {drugs.length > 1 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeDrugField(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          
          <Button
            variant="outline"
            onClick={addDrugField}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Medication
          </Button>
        </div>

        <Button
          variant="medical"
          onClick={checkInteractions}
          disabled={isAnalyzing || drugs.every(drug => drug.trim() === "")}
          className="w-full"
        >
          {isAnalyzing ? "Analyzing..." : "Check Interactions"}
        </Button>

        {interactions.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Interaction Results</h3>
            {interactions.map((interaction, index) => (
              <Card key={index} className="border-l-4 border-l-destructive">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex gap-2">
                      <Badge variant={getSeverityColor(interaction.severity)}>
                        {interaction.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <p className="font-medium mb-1">
                    {interaction.drug1} + {interaction.drug2}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {interaction.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {interactions.length === 0 && drugs.some(drug => drug.trim() !== "") && !isAnalyzing && (
          <Card className="border-l-4 border-l-success">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <p className="font-medium">No interactions detected</p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                The medications you entered appear to be safe to take together.
              </p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};