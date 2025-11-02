import { useEffect, type JSX } from "react";
import { X } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

export const VideoModal = ({ isOpen, onClose, videoUrl }: VideoModalProps): JSX.Element => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return <></>;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl mx-4 bg-[#749fbf] rounded-[40px] p-2 md:p-4 shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-10 w-10 h-10 bg-[#85b5d9] rounded-full flex items-center justify-center hover:bg-[#749fbf] transition-colors shadow-lg border-2 border-white/20"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Video Container */}
        <div className="relative w-full rounded-[32px] overflow-hidden bg-black">
          <video
            src={videoUrl}
            controls
            autoPlay
            className="w-full h-auto max-h-[80vh] object-contain"
            style={{ aspectRatio: '16/9' }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

