export type UploadedImage = {
    id: string;
    name: string;
    path: string;
    url: string;
    size: number;
};

export type UploadMediaModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUploadSuccess?: (files: UploadedImage[]) => void;
};

export type UploadedFile = {
    id: string;
    file: File;
    preview: string;
    progress: number;
};
