import { useState } from 'react';
import { Check, X, Pencil } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

type VideoProjectHeaderProps = {
    title: string;
    onTitleChange: (title: string) => void;
};

export default function VideoProjectHeader({
    title,
    onTitleChange,
}: VideoProjectHeaderProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(title);

    const handleSave = () => {
        if (editValue.trim()) {
            onTitleChange(editValue);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditValue(title);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    if (isEditing) {
        return (
            <div className="p-6">
                <Input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="mb-4"
                    placeholder="Enter project title"
                    autoFocus
                />
                <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm" className="gap-2">
                        <Check className="h-4 w-4" />
                        Save
                    </Button>
                    <Button
                        onClick={handleCancel}
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                    >
                        <X className="h-4 w-4" />
                        Cancel
                    </Button>
                </div>
                <Separator className="mt-6" />
            </div>
        );
    }

    return (
        <>
            <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <h1 className="mb-1 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                            Video Project
                        </h1>
                        <p className="truncate text-lg font-semibold text-foreground">
                            {title}
                        </p>
                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 shrink-0 p-0"
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit project title</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
            <Separator />
        </>
    );
}
