import { useState, useRef, useEffect } from "react";
import { X, Upload, Trash2 } from "lucide-react";
import Button from "@/components/atoms/FormSubmitBtn";
import ImageCropModal from "./ImageCropModal";

const ImageViewModal = ({
  isOpen,
  onClose,
  imageUrl: initialImage,
  onUpload, // <- Function to actually upload to server
  onRemove,
  isUploading,
}) => {
  const [preview, setPreview] = useState(initialImage || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const fileInputRef = useRef(null);

  // Sync preview with initialImage when it changes
  useEffect(() => {
    setPreview(initialImage || null);
  }, [initialImage]);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview for cropping
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageToCrop(reader.result);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedFile) => {
    // Create preview from cropped file
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(croppedFile);

    setSelectedFile(croppedFile);
    setShowCropModal(false);
  };

  const handleUploadConfirm = async () => {
    if (selectedFile && onUpload) {
      await onUpload({ target: { files: [selectedFile] } });
      setSelectedFile(null);
    }
  };

  const handleButtonClick = () => {
    if (!isUploading) fileInputRef.current?.click();
  };

  const handleCancel = () => {
    setPreview(initialImage);
    setSelectedFile(null);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h3 className="text-xl font-semibold text-text">Profile Picture</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-card-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          {/* Image Preview */}
          <div className="p-8 flex items-center justify-center bg-card-soft">
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                className="max-w-full max-h-96 rounded-2xl shadow-xl object-cover"
              />
            ) : (
              <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Upload className="w-16 h-16 text-text-secondary" />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-border flex justify-center gap-3">
            <input
              ref={fileInputRef}
              id="inputFile"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
            />

            {!selectedFile ? (
              <Button
                type="button"
                onClick={handleButtonClick}
                disabled={isUploading}
                className="!m-0  px-6 py-2.5 rounded-full bg-primary hover:brightness-110 text-white font-medium transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 max-w-xs"
              >
                <Upload className="w-4 h-4" />
                {isUploading
                  ? "Uploading..."
                  : preview
                    ? "Change Photo"
                    : "Upload Photo"}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleUploadConfirm}
                disabled={isUploading}
                className="!m-0 !w-auto  px-6 py-2.5 rounded-full bg-primary hover:brightness-110 text-white font-medium transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 max-w-xs"
              >
                <Upload className="w-4 h-4" />
                Confirm Upload
              </Button>
            )}

            {/* Show Remove only if there's an existing uploaded image */}
            {initialImage && !selectedFile && (
              <Button
                type="button"
                onClick={onRemove}
                disabled={isUploading}
                className="!m-0 px-6 py-2.5 rounded-full border border-red-500/50 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 max-w-xs"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </Button>
            )}

            {/* Show Cancel if user is just previewing a new selection */}
            {selectedFile && (
              <Button
                type="button"
                onClick={handleCancel}
                disabled={isUploading}
                className="!m-0 !w-auto px-6 py-2.5 rounded-full border border-border bg-card-muted hover:bg-card text-text font-medium transition-all duration-200 disabled:opacity-50 max-w-xs"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Crop Modal */}
      <ImageCropModal
        isOpen={showCropModal}
        onClose={() => setShowCropModal(false)}
        imageSrc={imageToCrop}
        onCropComplete={handleCropComplete}
      />
    </>
  );
};

export default ImageViewModal;
