import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { DashboardV2Layout } from '@/layouts/dashboard-v2-layout';
import { StepIndicator } from '@/components/wizard/StepIndicator';
import { MediaAssetsStep } from '@/components/wizard/steps/MediaAssetsStep';
import { VideoScriptStep } from '@/components/wizard/steps/VideoScriptStep';
import { GenerationSettingsStep } from '@/components/wizard/steps/GenerationSettingsStep';
import { v2 } from '@/actions/App/Http/Controllers/VideoCreatorController';

export default function VideoCreatorV2Wizard() {
    const [currentStep, setCurrentStep] = useState(1);

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 3));
    const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    return (
        <DashboardV2Layout title="VidGen AI - Create New Project">
            <div className="max-w-4xl mx-auto w-full">
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                        <Link href={v2()} className="hover:text-indigo-500 transition-colors">All Videos</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="font-medium text-slate-900">New Project</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Create New Project</h2>
                </div>

                <StepIndicator currentStep={currentStep} />

                {currentStep === 1 && <MediaAssetsStep onNext={handleNext} />}
                {currentStep === 2 && <VideoScriptStep onNext={handleNext} onBack={handleBack} />}
                {currentStep === 3 && <GenerationSettingsStep onBack={handleBack} />}
            </div>
        </DashboardV2Layout>
    );
}
