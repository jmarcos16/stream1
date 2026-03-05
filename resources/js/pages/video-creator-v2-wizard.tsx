import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { DashboardV2Layout } from '@/layouts/dashboard-v2-layout';
import { StepIndicator } from '@/components/wizard/StepIndicator';
import { MediaAssetsStep } from '@/components/wizard/steps/MediaAssetsStep';
import { VideoScriptStep } from '@/components/wizard/steps/VideoScriptStep';
import { GenerationSettingsStep } from '@/components/wizard/steps/GenerationSettingsStep';
import { Video } from '@/types/video';
import { v2 } from '@/routes/video-creator';

type UploadedFile = {
    id: string;
    name: string;
    path: string;
    url: string;
};

type Props = {
    video: Video;
    existingImages: UploadedFile[];
};

export default function VideoCreatorV2Wizard({ video, existingImages }: Props) {
    const [currentStep, setCurrentStep] = useState(1);
    
    const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
    const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    return (
        <DashboardV2Layout title="VidGen AI - Create New Project">
            <div className="mx-auto w-full max-w-4xl">
                <div className="mb-8">
                    <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                        <Link
                            href={v2()}
                            className="transition-colors hover:text-indigo-500"
                        >
                            All Videos
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="font-medium text-slate-900">
                            New Project
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Create New Project
                    </h2>
                </div>

                <StepIndicator currentStep={currentStep} />

                {currentStep === 1 && <MediaAssetsStep video={video} existingImages={existingImages} onNext={handleNext} />}
                {currentStep === 2 && (
                    <VideoScriptStep video={video} onNext={handleNext} onBack={handleBack} />
                )}
                {currentStep === 3 && (
                    <GenerationSettingsStep onBack={handleBack} />
                )}
            </div>
        </DashboardV2Layout>
    );
}
