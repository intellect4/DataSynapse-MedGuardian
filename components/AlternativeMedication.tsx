import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, Pill, Star, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Alternative {
  name: string;
  genericName: string;
  strength: string;
  advantages: string[];
  considerations: string[];
  rating: number;
  cost: "lower" | "similar" | "higher";
}

const mockAlternatives: Alternative[] = [
  {
    name: "Amoxicillin/Clavulanate",
    genericName: "Co-amoxiclav",
    strength: "875mg/125mg",
    advantages: ["Broader spectrum", "Better bioavailability", "Fewer doses per day"],
    considerations: ["Higher cost", "More side effects possible"],
    rating: 4.5,
    cost: "higher"
  },
  {
    name: "Azithromycin",
    genericName: "Zithromax",
    strength: "250mg",
    advantages: ["Once daily dosing", "Shorter course", "Good tissue penetration"],
    considerations: ["Different spectrum", "QT prolongation risk"],
    rating: 4.2,
    cost: "similar"
  },
  {
    name: "Cephalexin",
    genericName: "Keflex",
    strength: "500mg",
    advantages: ["Lower cost", "Well tolerated", "Pregnancy safe"],
    considerations: ["Narrower spectrum", "Multiple daily doses"],
    rating: 4.0,
    cost: "lower"
  }
];

export const AlternativeMedication = () => {
  const [currentMedication, setCurrentMedication] = useState("");
  const [allergies, setAllergies] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const searchAlternatives = async () => {
    if (!currentMedication.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter the current medication",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);

    // Simulate API search
    setTimeout(() => {
      setAlternatives(mockAlternatives);
      setIsSearching(false);
      toast({
        title: "Alternatives Found",
        description: `Found ${mockAlternatives.length} suitable alternatives`,
      });
    }, 2000);
  };

  const getCostColor = (cost: string) => {
    switch (cost) {
      case "lower": return "success";
      case "higher": return "warning";
      default: return "secondary";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-primary" />
          Alternative Medication Suggestions
        </CardTitle>
        <CardDescription>
          Find safer or equivalent medications based on patient profile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-med">Current Medication</Label>
            <Input
              id="current-med"
              placeholder="e.g., Amoxicillin 500mg"
              value={currentMedication}
              onChange={(e) => setCurrentMedication(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="allergies">Known Allergies</Label>
            <Input
              id="allergies"
              placeholder="e.g., Penicillin, Sulfa drugs"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="conditions">Medical Conditions</Label>
            <Textarea
              id="conditions"
              placeholder="e.g., Kidney disease, Heart conditions"
              value={medicalConditions}
              onChange={(e) => setMedicalConditions(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </div>

        <Button
          variant="medical"
          onClick={searchAlternatives}
          disabled={isSearching}
          className="w-full"
        >
          {isSearching ? "Searching..." : "Find Alternatives"}
        </Button>

        {alternatives.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Recommended Alternatives</h3>
            {alternatives.map((alt, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg flex items-center gap-2">
                        <Pill className="h-5 w-5 text-primary" />
                        {alt.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Generic: {alt.genericName} • Strength: {alt.strength}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(alt.rating)}</div>
                      <Badge variant={getCostColor(alt.cost)}>
                        {alt.cost} cost
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-success">Advantages</Label>
                      <ul className="text-sm mt-1 space-y-1">
                        {alt.advantages.map((advantage, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-success mt-1">•</span>
                            {advantage}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-warning flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        Considerations
                      </Label>
                      <ul className="text-sm mt-1 space-y-1">
                        {alt.considerations.map((consideration, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-warning mt-1">•</span>
                            {consideration}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};