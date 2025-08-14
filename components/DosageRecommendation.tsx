import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calculator, Info, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DosageResult {
  medication: string;
  age: number;
  weight: number;
  recommendedDose: string;
  frequency: string;
  maxDaily: string;
  warnings: string[];
}

export const DosageRecommendation = () => {
  const [medication, setMedication] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [condition, setCondition] = useState("");
  const [result, setResult] = useState<DosageResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const calculateDosage = async () => {
    if (!medication || !age || !weight) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);

    // Simulate dosage calculation
    setTimeout(() => {
      const ageNum = parseInt(age);
      const weightNum = parseFloat(weight);
      
      // Mock dosage calculation based on age and weight
      let baseDose = 10; // mg/kg base dose
      let frequency = "twice daily";
      let warnings: string[] = [];

      if (ageNum < 12) {
        baseDose = 8;
        warnings.push("Pediatric dosing - monitor closely");
      } else if (ageNum > 65) {
        baseDose = 6;
        warnings.push("Geriatric dosing - reduced dose due to age");
      }

      const calculatedDose = baseDose * weightNum;
      const maxDaily = calculatedDose * 2;

      setResult({
        medication,
        age: ageNum,
        weight: weightNum,
        recommendedDose: `${calculatedDose.toFixed(1)} mg`,
        frequency,
        maxDaily: `${maxDaily.toFixed(1)} mg`,
        warnings
      });

      setIsCalculating(false);
      toast({
        title: "Dosage Calculated",
        description: "Recommendations generated based on patient profile",
      });
    }, 1500);
  };

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Age-Specific Dosage Recommendation
        </CardTitle>
        <CardDescription>
          Get personalized dosage recommendations based on age and weight
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="medication">Medication Name</Label>
            <Input
              id="medication"
              placeholder="e.g., Amoxicillin"
              value={medication}
              onChange={(e) => setMedication(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Medical Condition</Label>
            <Select value={condition} onValueChange={setCondition}>
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="infection">Bacterial Infection</SelectItem>
                <SelectItem value="pain">Pain Management</SelectItem>
                <SelectItem value="hypertension">Hypertension</SelectItem>
                <SelectItem value="diabetes">Diabetes</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age (years)</Label>
            <Input
              id="age"
              type="number"
              placeholder="25"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              placeholder="70"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
        </div>

        <Button
          variant="medical"
          onClick={calculateDosage}
          disabled={isCalculating}
          className="w-full"
        >
          {isCalculating ? "Calculating..." : "Calculate Dosage"}
        </Button>

        {result && (
          <Card className="bg-accent/50 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Dosage Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Recommended Dose</Label>
                  <p className="text-lg font-semibold text-primary">{result.recommendedDose}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Frequency</Label>
                  <p className="text-lg font-semibold">{result.frequency}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Maximum Daily Dose</Label>
                  <p className="text-lg font-semibold text-warning">{result.maxDaily}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Patient Profile</Label>
                  <p className="text-lg">{result.age} years, {result.weight} kg</p>
                </div>
              </div>

              {result.warnings.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground flex items-center gap-1">
                    <Info className="h-4 w-4" />
                    Important Warnings
                  </Label>
                  <div className="space-y-2">
                    {result.warnings.map((warning, index) => (
                      <Badge key={index} variant="warning" className="block w-fit">
                        {warning}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                <strong>Disclaimer:</strong> This is a calculated recommendation. Always consult with a healthcare professional before administering medication.
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};