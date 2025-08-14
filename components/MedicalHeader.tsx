import { Activity, Shield, Stethoscope } from "lucide-react";

export const MedicalHeader = () => {
  return (
    <header className="bg-gradient-hero text-white py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex justify-center items-center gap-3 mb-6">
          <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">MedGuardian</h1>
          <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
            <Stethoscope className="h-8 w-8" />
          </div>
        </div>
        
        <p className="text-xl md:text-2xl mb-4 text-white/90">
          AI-Powered Medical Prescription Verification
        </p>
        
        <p className="text-lg mb-8 text-white/80 max-w-3xl mx-auto">
          Advanced drug interaction detection, age-specific dosage recommendations, 
          and alternative medication suggestions powered by IBM Watson and Hugging Face models
        </p>
        
        <div className="flex justify-center items-center gap-2 text-white/70">
          <Activity className="h-5 w-5" />
          <span className="text-sm">Real-time Analysis • Safe Prescribing • Evidence-Based</span>
        </div>
      </div>
    </header>
  );
};