
import React, { useRef, useState } from 'react';
import { UploadIcon } from '../icons/UploadIcon';

interface FileUploadProps {
  label: string;
  onFileSelect: (file: File | null) => void;
  accept?: string;
  required?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ label, onFileSelect, accept = 'image/*', required = false }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFileName(file?.name || null);
    onFileSelect(file);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div
        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-primary transition"
        onClick={handleClick}
      >
        <div className="space-y-1 text-center">
          <UploadIcon className="mx-auto h-10 w-10 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <p className="pl-1">{fileName ? fileName : 'Click to upload a file'}</p>
          </div>
          <p className="text-xs text-gray-500">{accept.replace('image/','').toUpperCase()} files</p>
        </div>
      </div>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={accept}
        required={required}
      />
    </div>
  );
};
