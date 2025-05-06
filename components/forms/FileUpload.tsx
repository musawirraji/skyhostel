import React, { useState, useEffect } from 'react';
import { Control, useController } from 'react-hook-form';
import { Upload, Loader2, Check, AlertCircle } from 'lucide-react';
import { uploadToImageKit } from '@/lib/imagekit';

interface FileUploadProps {
  name: string;
  control: Control<any>;
  label: string;
  accept?: string;
  maxSize?: number; // in MB
  required?: boolean;
}

// Type for the ImageKit response
interface ImageKitResponse {
  file: File;
  url: string;
  fileId: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  name,
  control,
  label,
  accept = 'image/*',
  maxSize = 3, // Default 3MB
  required = false,
}) => {
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: { required: required ? `${label} is required` : false },
  });

  // Initialize filePreview when field has a value (for editing forms)
  useEffect(() => {
    const currentValue = field.value;
    if (!currentValue) return;

    // If field value is an ImageKit response object with url
    if (
      currentValue &&
      typeof currentValue === 'object' &&
      'url' in currentValue
    ) {
      setFilePreview(currentValue.url);
      setUploadSuccess(true);
    }
    // If field value is a File object
    else if (currentValue instanceof File) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFilePreview(event.target?.result as string);
      };
      reader.readAsDataURL(currentValue);
    }
  }, [field.value]);

  // Enhanced file change handler for better error handling
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setErrorMessage(null);
    setUploadProgress(0);
    setUploadSuccess(false);

    if (!file) {
      field.onChange(null);
      setFilePreview(null);
      return;
    }

    console.log('File selected:', file.name, file.type, file.size);

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setErrorMessage(`File size exceeds ${maxSize}MB limit`);
      field.onChange(null);
      setFilePreview(null);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setFilePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // First set the file object for the form
    field.onChange(file);

    // Only upload passport photos to ImageKit
    if (name.includes('passport')) {
      try {
        setIsUploading(true);
        console.log('Starting ImageKit upload');

        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 300);

        // Upload to ImageKit
        const result = await uploadToImageKit(file);
        clearInterval(progressInterval);
        setUploadProgress(100);
        console.log('ImageKit upload result:', result);

        if (result.success) {
          setUploadSuccess(true);
          console.log(
            'Upload successful, setting form value with ImageKit URL'
          );

          // Store both the file and the URL for the form submission
          field.onChange({
            file,
            url: result.url,
            fileId: result.fileId,
          });
        } else {
          console.error('Upload failed:', result.error);
          setErrorMessage(
            `Error uploading: ${result.error || 'Unknown error'}`
          );

          // Keep the file in the form for traditional upload fallback
          field.onChange(file);
        }
      } catch (error) {
        console.error('Exception during upload:', error);
        setErrorMessage(
          `Upload failed: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        );

        // Keep the file in the form for traditional upload fallback
        field.onChange(file);
      } finally {
        setIsUploading(false);
        setTimeout(() => {
          setUploadProgress(0);
        }, 2000);
      }
    }
  };

  const resetUpload = () => {
    field.onChange(null);
    setFilePreview(null);
    setUploadSuccess(false);
    setErrorMessage(null);
  };

  // Get the image URL preview - handle both File and ImageKit response
  const getPreviewUrl = () => {
    if (!field.value) return null;

    // If it's an ImageKit response
    if (typeof field.value === 'object' && 'url' in field.value) {
      return field.value.url;
    }

    // If it's a File and we have a preview
    return filePreview;
  };

  // Add this function to check field value type for debugging
  const getValueType = (value: any): string => {
    if (value === null || value === undefined) return 'null/undefined';
    if (value instanceof File) return 'File';
    if (typeof value === 'object') {
      if ('url' in value && 'file' in value) return 'ImageKit response object';
      return 'other object: ' + JSON.stringify(value);
    }
    return typeof value;
  };

  return (
    <div className='mb-4'>
      <label
        htmlFor={name}
        className='block text-sm font-medium text-gray-700 mb-1'
      >
        {label}
        {required && <span className='text-red-500 ml-1'>*</span>}
      </label>

      <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md'>
        <div className='space-y-1 text-center'>
          {filePreview ? (
            <div className='flex flex-col items-center'>
              <img
                src={getPreviewUrl() || filePreview}
                alt='Preview'
                className='h-32 w-auto object-contain mb-2'
              />

              {isUploading ? (
                <div className='w-full max-w-xs'>
                  <div className='w-full bg-gray-200 rounded-full h-2.5'>
                    <div
                      className='bg-blue-600 h-2.5 rounded-full'
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className='text-xs text-gray-500 mt-1 flex items-center justify-center'>
                    <Loader2 className='animate-spin h-3 w-3 mr-1' />
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              ) : uploadSuccess ? (
                <div className='flex items-center text-sm text-green-600'>
                  <Check className='h-4 w-4 mr-1' />
                  Uploaded successfully to ImageKit
                </div>
              ) : (
                <div className='flex flex-col gap-2'>
                  <span className='text-xs text-gray-500'>
                    {name.includes('passport')
                      ? 'Click upload to save to ImageKit'
                      : 'File selected'}
                  </span>
                  <div className='flex gap-2'>
                    {name.includes('passport') && !uploadSuccess && (
                      <button
                        type='button'
                        onClick={async () => {
                          if (field.value instanceof File) {
                            // Create a synthetic event for the file upload
                            const file = field.value;
                            setIsUploading(true);
                            setUploadProgress(0);

                            // Simulate progress
                            const progressInterval = setInterval(() => {
                              setUploadProgress((prev) => {
                                if (prev >= 90) {
                                  clearInterval(progressInterval);
                                  return 90;
                                }
                                return prev + 10;
                              });
                            }, 300);

                            try {
                              // Upload to ImageKit
                              const result = await uploadToImageKit(file);
                              clearInterval(progressInterval);
                              setUploadProgress(100);

                              if (result.success) {
                                setUploadSuccess(true);
                                field.onChange({
                                  file,
                                  url: result.url,
                                  fileId: result.fileId,
                                });
                              } else {
                                setErrorMessage(
                                  `Error uploading: ${
                                    result.error || 'Unknown error'
                                  }`
                                );
                              }
                            } catch (error) {
                              setErrorMessage(
                                `Upload failed: ${
                                  error instanceof Error
                                    ? error.message
                                    : 'Unknown error'
                                }`
                              );
                            } finally {
                              setIsUploading(false);
                              setTimeout(() => {
                                setUploadProgress(0);
                              }, 2000);
                            }
                          }
                        }}
                        className='text-sm bg-blue-600 text-white px-3 py-1 rounded-md'
                      >
                        Upload
                      </button>
                    )}
                    <button
                      type='button'
                      onClick={resetUpload}
                      className='text-sm text-red-500 border border-red-500 px-3 py-1 rounded-md'
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Upload className='mx-auto h-12 w-12 text-gray-400' />
              <div className='flex text-sm text-gray-600'>
                <label
                  htmlFor={name}
                  className='relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-700 focus-within:outline-none'
                >
                  <span>Choose a file</span>
                  <input
                    id={name}
                    name={name}
                    type='file'
                    accept={accept}
                    onChange={handleFileChange}
                    className='sr-only'
                    disabled={isUploading}
                  />
                </label>
                <p className='pl-1'>or drag and drop</p>
              </div>
              <p className='text-xs text-gray-500'>
                Only {accept.replace(/\*/g, '').replace(/,/g, ', ')} are
                accepted. {maxSize}MB Max.
              </p>
            </>
          )}
        </div>
      </div>

      {(error || errorMessage) && (
        <div>
          <p className='mt-1 text-sm text-red-500 flex items-center'>
            <AlertCircle className='h-3 w-3 mr-1' />
            {errorMessage || error?.message}
          </p>
          <p className='mt-1 text-xs text-gray-400'>
            Current field value type: {getValueType(field.value)}
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
