import { MedicalHeader } from "@/components/MedicalHeader";
import { DrugInteractionChecker } from "@/components/DrugInteractionChecker";
import { DosageRecommendation } from "@/components/DosageRecommendation";
import { AlternativeMedication } from "@/components/AlternativeMedication";
import { PrescriptionAnalyzer } from "@/components/PrescriptionAnalyzer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <MedicalHeader />
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="space-y-8">
            <DrugInteractionChecker />
            <AlternativeMedication />
          </div>
          
          <div className="space-y-8">
            <DosageRecommendation />
            <PrescriptionAnalyzer />
          </div>
        </div>
        
        <footer className="mt-16 py-8 border-t border-border">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              MedGuardian AI • Powered by IBM Watson & Hugging Face • 
              <span className="text-primary font-medium"> Always consult healthcare professionals</span>
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
