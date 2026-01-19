import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X } from "lucide-react";
import Button from "@/components/atoms/FormSubmitBtn";
import { createCroppedImage } from "@/utils/cropImage";

const ImageCropModal = ({ isOpen, onClose, imageSrc, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const onCropCompleteCallback = useCallback(
    (croppedArea, croppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  // Early return AFTER all hooks
  if (!isOpen) return null;

  const handleCropConfirm = async () => {
    try {
      setIsProcessing(true);
      const croppedBlob = await createCroppedImage(imageSrc, croppedAreaPixels);

      // Convert blob to file
      const file = new File([croppedBlob], "profile-image.jpg", {
        type: "image/jpeg",
      });

      onCropComplete(file);
      onClose();
    } catch (error) {
      console.error("Error cropping image:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-xl font-semibold text-text">
            Crop Profile Picture
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-card-muted rounded-lg transition-colors"
            disabled={isProcessing}
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Crop Area */}
        <div className="relative w-full h-96 bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="rect"
            showGrid={false}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteCallback}
          />
        </div>

        {/* Zoom Control */}
        <div className="p-6 border-t border-border bg-card-soft">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-text-secondary min-w-[60px]">
              Zoom
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
              disabled={isProcessing}
            />
            <span className="text-sm text-text-secondary min-w-[40px] text-right">
              {zoom.toFixed(1)}x
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-border flex justify-center gap-3">
          <Button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="!m-0 !w-auto px-6 py-2.5 rounded-full border border-border bg-card-muted hover:bg-card text-text font-medium transition-all duration-200 disabled:opacity-50 max-w-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleCropConfirm}
            disabled={isProcessing}
            className="!m-0 !w-auto px-6 py-2.5 rounded-full bg-primary hover:brightness-110 text-white font-medium transition-all duration-200 disabled:opacity-50 max-w-xs"
          >
            {isProcessing ? "Processing..." : "Crop & Upload"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
