'use client';

import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { http } from '../../services/httpclient';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  uploadType: 'gallery' | 'travel-packets';
  placeholder?: string;
  className?: string;
}

interface UploadResponse {
  message: string;
  url: string;
  filename: string;
}

const getAuthToken = (): string | null => {
  const nameEQ = 'adminToken=';
  const cookies = document.cookie.split(';');

  for (const cookie of cookies) {
    let c = cookie;
    while (c.startsWith(' ')) c = c.substring(1);
    if (c.startsWith(nameEQ)) return c.substring(nameEQ.length);
  }

  return null;
};

const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  uploadType,
  placeholder = 'Įkelkite nuotrauką arba įveskite URL',
  className = '',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Galima įkelti tik nuotraukas');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Failo dydis negali viršyti 5MB');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const endpoint =
        uploadType === 'travel-packets'
          ? '/admin/upload/travel-packets'
          : '/admin/upload/gallery';

      const result = await http<UploadResponse>(endpoint, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      });

      onChange(result.url);
    } catch (error) {
      setUploadError('Nepavyko įkelti failo. Bandykite dar kartą.');
    } finally {
      setIsUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
    setUploadError(null);
  };

  const handleRemoveImage = () => {
    onChange('');
    setUploadError(null);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div>
        <input
          type="url"
          value={value}
          onChange={handleUrlChange}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div className="flex items-center space-x-3">
        <div className="text-sm text-gray-500">arba</div>

        <button
          type="button"
          onClick={handleUploadClick}
          disabled={isUploading}
          className="flex items-center space-x-2 rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-200 disabled:cursor-not-allowed disabled:bg-gray-50"
        >
          {isUploading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-teal-600"></div>
              <span>Įkeliama...</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              <span>Įkelti failą</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {uploadError && <div className="text-sm text-red-600">{uploadError}</div>}

      {value && (
        <div className="relative inline-block">
          <div className="group relative">
            <img
              src={value}
              alt="Preview"
              className="h-32 w-32 rounded-lg border border-gray-200 object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity duration-200 hover:bg-red-600 group-hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-2 max-w-32 truncate text-xs text-gray-500">
            {value.split('/').pop()}
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500">
        Palaikomi formatai: JPG, PNG, WEBP. Maksimalus dydis: 5MB
      </div>
    </div>
  );
};

export default ImageUpload;