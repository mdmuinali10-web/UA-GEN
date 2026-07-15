import { useState, useRef, useEffect, DragEvent, ChangeEvent } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  FileImage, 
  Download, 
  RefreshCw, 
  Sliders, 
  CheckCircle, 
  X,
  Lock,
  Unlock,
  ImageIcon,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import heic2any from 'heic2any';

interface PhotoResizeToolProps {
  onBack: () => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function PhotoResizeTool({ onBack, onShowToast }: PhotoResizeToolProps) {
  // Original file states
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  const [originalFormat, setOriginalFormat] = useState<string>('');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState<number>(1);

  // Settings states
  const [outputFormat, setOutputFormat] = useState<'png' | 'jpeg' | 'webp' | 'gif'>('jpeg');
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [quality, setQuality] = useState<number>(85);
  const [activeQuickScale, setActiveQuickScale] = useState<number | null>(100);

  // Status & output states
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const [isConvertingHeic, setIsConvertingHeic] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);

  // Converted result states
  const [resultUrl, setResultUrl] = useState<string>('');
  const [resultSize, setResultSize] = useState<number>(0);
  const [resultWidth, setResultWidth] = useState<number>(0);
  const [resultHeight, setResultHeight] = useState<number>(0);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Cleanup object URLs to prevent memory leaks on unmount
  const originalUrlRef = useRef<string>(originalUrl);
  const resultUrlRef = useRef<string>(resultUrl);

  useEffect(() => {
    originalUrlRef.current = originalUrl;
    resultUrlRef.current = resultUrl;
  }, [originalUrl, resultUrl]);

  useEffect(() => {
    return () => {
      if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current);
      if (resultUrlRef.current && resultUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(resultUrlRef.current);
      }
    };
  }, []);

  // Format size nicely
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Convert HEIC or handle standard image
  const handleImageFile = (file: File) => {
    const isHeic = file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic';

    if (isHeic) {
      setIsConvertingHeic(true);
      onShowToast("HEIC file detected. Converting client-side...", "info");

      heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.95
      })
        .then((result) => {
          const blobResult = Array.isArray(result) ? result[0] : result;
          const convertedFile = new File([blobResult], file.name.replace(/\.heic$/i, '.jpg'), {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          loadStandardImage(convertedFile);
          setIsConvertingHeic(false);
          onShowToast("HEIC successfully converted!", "success");
        })
        .catch((err) => {
          console.error("HEIC conversion failed:", err);
          onShowToast("HEIC conversion failed. Try another format.", "error");
          setIsConvertingHeic(false);
        });
    } else {
      loadStandardImage(file);
    }
  };

  const loadStandardImage = (file: File) => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    setOriginalFile(file);
    setOriginalSize(file.size);
    setOriginalFormat(file.name.substring(file.name.lastIndexOf('.') + 1).toUpperCase() || 'IMG');

    const url = URL.createObjectURL(file);
    setOriginalUrl(url);

    const img = new Image();
    img.onload = () => {
      setOriginalWidth(img.width);
      setOriginalHeight(img.height);
      const ratio = img.width / img.height;
      setAspectRatio(ratio);

      // Seed initial dimensions and preset scale to 100%
      setWidth(img.width);
      setHeight(img.height);
      setActiveQuickScale(100);
      setShowResult(false);
    };
    img.src = url;
  };

  // Dimension Change Handlers
  const handleWidthChange = (val: number) => {
    setWidth(val);
    setActiveQuickScale(null);
    if (lockAspectRatio && aspectRatio) {
      setHeight(Math.round(val / aspectRatio) || 0);
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    setActiveQuickScale(null);
    if (lockAspectRatio && aspectRatio) {
      setWidth(Math.round(val * aspectRatio) || 0);
    }
  };

  // Quick scale calculation (25%, 50%, 75%, 100%)
  const handleQuickScale = (percent: number) => {
    setActiveQuickScale(percent);
    const newWidth = Math.round(originalWidth * (percent / 100));
    const newHeight = Math.round(originalHeight * (percent / 100));
    setWidth(newWidth);
    setHeight(newHeight);
  };

  // Drag-and-drop handlers
  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic'];
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

      if (validExtensions.includes(ext) || file.type.startsWith('image/')) {
        if (file.size > 50 * 1024 * 1024) {
          onShowToast("File is too large! Maximum limit is 50MB.", "error");
          return;
        }
        handleImageFile(file);
      } else {
        onShowToast("Unsupported file. Please upload an image format.", "error");
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 50 * 1024 * 1024) {
        onShowToast("File is too large! Maximum limit is 50MB.", "error");
        return;
      }
      handleImageFile(file);
    }
  };

  // Process image using HTML5 Canvas
  const handleGenerate = () => {
    if (!originalFile || !originalUrl) return;

    if (width <= 0 || height <= 0) {
      onShowToast("Please enter valid width and height.", "error");
      return;
    }

    setIsProcessing(true);
    setShowResult(false); // Reset result view while processing new settings

    // Simulate conversion processing time (~800ms)
    setTimeout(() => {
      const img = new Image();
      
      // Crucial: Handle potential issues with revoked URLs or cross-origin
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          onShowToast("Failed to initialize canvas context.", "error");
          setIsProcessing(false);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Map formats to standard MIME types
        let mimeType = 'image/webp';
        if (outputFormat === 'jpeg') mimeType = 'image/jpeg';
        else if (outputFormat === 'png') mimeType = 'image/png';
        else if (outputFormat === 'gif') mimeType = 'image/gif';

        // Draw solid background for non-transparent formats
        if (mimeType === 'image/jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas output to blob
        const qVal = (outputFormat === 'png' || outputFormat === 'gif') ? undefined : quality / 100;
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Convert blob to DataURL to accurately compute base64 size (as requested)
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = () => {
                const dataUrl = reader.result as string;
                const base64Content = dataUrl.split(',')[1];
                // Base64 size estimation
                const calculatedSize = Math.floor(base64Content.length * 0.75);

                // Manual cleanup of old result URL if it was a blob
                if (resultUrl && resultUrl.startsWith('blob:')) {
                  URL.revokeObjectURL(resultUrl);
                }

                setResultBlob(blob);
                setResultUrl(dataUrl); // also acts as the source for preview
                setResultSize(calculatedSize);
                setResultWidth(width);
                setResultHeight(height);
                setShowResult(true);
                setIsProcessing(false);
                onShowToast("Conversion successful!", "success");

                // Smooth scroll to result section
                setTimeout(() => {
                  resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
              };
            } else {
              onShowToast("Rendering failed. Please try again.", "error");
              setIsProcessing(false);
            }
          },
          mimeType,
          qVal
        );
      };

      img.onerror = () => {
        console.error("Image load error for URL:", originalUrl);
        onShowToast("Error loading source image. Please re-upload.", "error");
        setIsProcessing(false);
      };

      img.src = originalUrl;
    }, 800);
  };

  const handleDownload = () => {
    if (!resultUrl || !originalFile) return;

    const baseName = originalFile.name.substring(0, originalFile.name.lastIndexOf('.'));
    const downloadName = `${baseName}_pixelconvert.${outputFormat}`;

    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast(`Downloaded: ${downloadName}`, "success");
  };

  const handleReset = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    setOriginalFile(null);
    setOriginalUrl('');
    setOriginalWidth(0);
    setOriginalHeight(0);
    setOriginalSize(0);
    setOriginalFormat('');

    setResultBlob(null);
    setResultUrl('');
    setResultSize(0);
    setResultWidth(0);
    setResultHeight(0);

    setShowResult(false);
    setActiveQuickScale(100);
    onShowToast("Started a brand new project!", "info");
  };

  // Compression analytics
  const sizeDifference = resultSize - originalSize;
  const isReduced = sizeDifference < 0;
  const percentageChange = originalSize > 0 
    ? Math.round((Math.abs(sizeDifference) / originalSize) * 100)
    : 0;

  // Render range input dynamically (lossless formats PNG/GIF are disabled)
  const isLossless = outputFormat === 'png' || outputFormat === 'gif';

  return (
    <div 
      className="p-6 md:p-8 rounded-2xl bg-px-bg text-px-on-surface border border-px-outline-variant/30 shadow-2xl relative overflow-hidden font-sans"
      id="photo-resize-container"
    >
      {/* Background glow overlay */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-px-primary/5 filter blur-[60px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-px-primary-container/5 filter blur-[60px] pointer-events-none z-0"></div>

      {/* Top Navigation & Tool Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-px-outline-variant/20 pb-5 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-px-surface-container border border-px-outline-variant/40 text-px-primary hover:bg-px-primary/10 hover:border-px-primary/30 transition-all active:scale-95 group cursor-pointer"
            title="Go Back"
            id="btn-back-to-menu"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <h2 className="text-2xl font-extrabold text-px-on-surface tracking-tight flex items-center gap-2 mt-0.5">
              <Sparkles className="w-6 h-6 text-px-primary animate-pulse" />
              ImageConvert
            </h2>
          </div>
        </div>
      </div>

      {/* 2-COLUMN GRID WORKSPACE: Always side-by-side on desktop (lg:grid-cols-12), stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10" id="workspace-grid">
        {/* Left Column (col-span-7) */}
        <div className="lg:col-span-7 w-full flex flex-col">
          <AnimatePresence mode="wait">
            {!originalFile ? (
              /* SECTION 1: DROPZONE */
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                id="dropzone-container"
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300 cursor-pointer min-h-[340px] z-10
                  ${isDragActive 
                    ? 'border-px-primary bg-px-surface-container shadow-[0_0_25px_rgba(192,193,255,0.2)]' 
                    : 'border-px-outline-variant/60 bg-px-surface-container-low hover:border-px-primary/60 hover:bg-px-surface-container/40'
                  }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png,.gif,.webp,.heic,image/*"
                  className="hidden"
                />

                {isConvertingHeic ? (
                  <div className="flex flex-col items-center space-y-4">
                    <RefreshCw className="w-12 h-12 text-px-primary animate-spin" />
                    <h3 className="text-lg font-bold text-px-primary font-mono tracking-wide">Converting HEIC Document...</h3>
                    <p className="text-xs text-px-on-surface-variant/60">Processing Apple format locally. No data leaves your machine.</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-full bg-px-primary/10 flex items-center justify-center text-px-primary mb-5 group-hover:scale-110 group-hover:bg-px-primary/20 transition-all duration-300 shadow-inner">
                      <Upload className="w-8 h-8" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-px-on-surface tracking-tight">
                      Click to upload or drag & drop
                    </h3>
                    <p className="text-xs text-px-on-surface-variant/60 mt-2 font-mono uppercase tracking-wider">
                      PNG, JPG, WebP, GIF or HEIC (Max 50MB)
                    </p>

                    <div className="mt-6">
                      <button
                        type="button"
                        className="px-6 py-2.5 bg-px-primary text-px-on-primary font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(192,193,255,0.5)] hover:scale-[1.03] active:scale-95 cursor-pointer flex items-center gap-2 text-sm mx-auto"
                      >
                        <ImageIcon className="w-4 h-4" />
                        Choose File
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              /* SOURCE PREVIEW CARD */
              <motion.div
                key="source-card"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="bg-px-surface-container/40 backdrop-blur-md border border-px-outline-variant/30 rounded-2xl p-5 shadow-xl flex flex-col"
                id="source-card"
              >
                <div className="flex items-center justify-between border-b border-px-outline-variant/20 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-px-primary animate-pulse"></span>
                    <span className="text-xs font-bold font-mono text-px-on-surface-variant uppercase tracking-widest">
                      SOURCE IMAGE
                    </span>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-xs font-bold font-mono text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    id="btn-clear-project"
                  >
                    ✕ Clear
                  </button>
                </div>

                {/* Image box */}
                <div className="flex items-center justify-center bg-px-surface-container-lowest/80 border border-px-outline-variant/20 rounded-xl p-4 min-h-[250px] max-h-[400px] overflow-hidden shadow-inner">
                  <img
                    src={originalUrl}
                    alt="Original Source Preview"
                    className="max-h-[360px] max-w-full object-contain rounded shadow-md transition-transform duration-300 hover:scale-[1.01]"
                  />
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-px-outline-variant/10">
                  <div className="text-center p-3 bg-px-surface-container-low/50 rounded-xl border border-px-outline-variant/20">
                    <span className="block text-[10px] font-mono text-px-on-surface-variant/60 uppercase tracking-wider">
                      ORIGINAL SIZE
                    </span>
                    <span className="block text-sm sm:text-base font-extrabold text-px-primary font-mono mt-1">
                      {formatBytes(originalSize)}
                    </span>
                  </div>
                  <div className="text-center p-3 bg-px-surface-container-low/50 rounded-xl border border-px-outline-variant/20">
                    <span className="block text-[10px] font-mono text-px-on-surface-variant/60 uppercase tracking-wider">
                      DIMENSIONS
                    </span>
                    <span className="block text-sm sm:text-base font-extrabold text-px-primary font-mono mt-1 truncate" title={`${originalWidth}×${originalHeight}`}>
                      {originalWidth}×{originalHeight}
                    </span>
                  </div>
                  <div className="text-center p-3 bg-px-surface-container-low/50 rounded-xl border border-px-outline-variant/20">
                    <span className="block text-[10px] font-mono text-px-on-surface-variant/60 uppercase tracking-wider">
                      FORMAT
                    </span>
                    <span className="block text-sm sm:text-base font-extrabold text-px-primary font-mono mt-1">
                      {originalFormat}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column (col-span-5) - Convert Settings card */}
        <div 
          className="lg:col-span-5 bg-px-surface-container/40 backdrop-blur-md border border-px-outline-variant/30 rounded-2xl p-5 shadow-xl lg:sticky lg:top-24 flex flex-col space-y-5 w-full"
          id="settings-card"
        >
          {/* Card Header */}
          <div className="flex items-center gap-2 border-b border-px-outline-variant/20 pb-3 mb-1">
            <Sliders className="w-4 h-4 text-px-primary" />
            <h3 className="text-sm font-bold font-mono text-px-on-surface uppercase tracking-wider">
              Convert Settings
            </h3>
          </div>

          {/* Output Format Choice */}
          <div className="flex flex-col space-y-2">
            <label className="text-[10px] font-bold font-mono text-px-on-surface-variant uppercase tracking-widest">
              OUTPUT FORMAT
            </label>
            <div className="grid grid-cols-2 gap-3.5">
              {(['jpeg', 'webp', 'png', 'gif'] as const).map((fmt) => {
                const isSelected = outputFormat === fmt;
                return (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setOutputFormat(fmt)}
                    className={`py-3.5 px-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border transition-all active:scale-95 cursor-pointer text-center
                      ${isSelected
                        ? 'bg-px-primary-container/20 text-px-primary border-2 border-px-primary shadow-[0_0_15px_rgba(192,193,255,0.15)]'
                        : 'bg-px-surface-container-low border-px-outline-variant/30 text-px-on-surface-variant/80 hover:bg-px-surface-container-high hover:text-px-on-surface'
                      }`}
                  >
                    {fmt === 'jpeg' ? 'JPG' : fmt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dimension Settings with Aspect Ratio Lock */}
          <div className="flex flex-col space-y-3.5 border-t border-px-outline-variant/10 pt-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold font-mono text-px-on-surface-variant uppercase tracking-widest">
                DIMENSIONS
              </label>
              <label className="flex items-center gap-1.5 text-xs text-px-on-surface-variant cursor-pointer select-none group font-mono">
                <input
                  type="checkbox"
                  checked={lockAspectRatio}
                  onChange={(e) => {
                    setLockAspectRatio(e.target.checked);
                    if (e.target.checked && aspectRatio) {
                      setHeight(Math.round(width / aspectRatio) || 0);
                    }
                  }}
                  className="rounded bg-px-surface-container-lowest border-px-outline-variant/60 text-px-primary focus:ring-px-primary/30 w-3.5 h-3.5 cursor-pointer focus:ring-offset-0"
                />
                {lockAspectRatio ? (
                  <span className="flex items-center gap-1 text-px-primary">
                    <Lock className="w-3.5 h-3.5" /> Lock Aspect
                  </span>
                ) : (
                  <span className="flex items-center gap-1 group-hover:text-px-on-surface transition-colors">
                    <Unlock className="w-3.5 h-3.5" /> Free Scale
                  </span>
                )}
              </label>
            </div>

            {/* Inputs Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-px-on-surface-variant/50 uppercase block">Width (px)</span>
                <input
                  type="number"
                  min="10"
                  max="10000"
                  placeholder={originalFile ? String(originalWidth) : "Width"}
                  disabled={!originalFile}
                  value={width || ''}
                  onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                  className="w-full bg-px-surface-container-lowest border border-px-outline-variant/50 focus:border-px-primary focus:ring-1 focus:ring-px-primary/30 focus:outline-none rounded-xl px-3.5 py-2 text-sm text-px-on-surface font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-px-on-surface-variant/50 uppercase block">Height (px)</span>
                <input
                  type="number"
                  min="10"
                  max="10000"
                  placeholder={originalFile ? String(originalHeight) : "Height"}
                  disabled={!originalFile}
                  value={height || ''}
                  onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                  className="w-full bg-px-surface-container-lowest border border-px-outline-variant/50 focus:border-px-primary focus:ring-1 focus:ring-px-primary/30 focus:outline-none rounded-xl px-3.5 py-2 text-sm text-px-on-surface font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Quick Scale presets */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {[25, 50, 75, 100].map((percent) => {
                const isPresetActive = activeQuickScale === percent;
                return (
                  <button
                    key={percent}
                    type="button"
                    disabled={!originalFile}
                    onClick={() => handleQuickScale(percent)}
                    className={`py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer border disabled:opacity-40 disabled:cursor-not-allowed
                      ${isPresetActive && originalFile
                        ? 'bg-px-primary/20 text-px-primary border-px-primary'
                        : 'bg-px-surface-container-lowest border-px-outline-variant/30 text-px-on-surface-variant/70 hover:bg-px-surface-container-high'
                      }`}
                  >
                    {percent}%
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quality Settings (Lossless formats are dimmed and disabled) */}
          <div className={`flex flex-col space-y-2 border-t border-px-outline-variant/10 pt-4 transition-opacity duration-300 ${isLossless || !originalFile ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            <div className="flex items-center justify-between font-mono">
              <label className="text-[10px] font-bold text-px-on-surface-variant uppercase tracking-widest">
                QUALITY
              </label>
              <span className="text-xs font-extrabold text-px-primary">
                {isLossless ? 'LOSSLESS' : `${quality}%`}
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              disabled={isLossless || !originalFile}
              value={quality}
              onChange={(e) => {
                setQuality(parseInt(e.target.value));
                setActiveQuickScale(null);
              }}
              className="w-full accent-px-primary bg-px-surface-container-lowest h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            {isLossless && (
              <p className="text-[10px] font-mono text-px-on-surface-variant/50 italic">
                PNG/GIF are lossless formats; quality adjustment is bypass-disabled.
              </p>
            )}
          </div>

          {/* Apply / Processing Buttons */}
          <div className="pt-2">
            <button
              type="button"
              id="btn-process-image"
              onClick={handleGenerate}
              disabled={isProcessing || !originalFile || width <= 0 || height <= 0}
              className="w-full py-4 px-6 bg-px-primary text-px-on-primary font-extrabold font-mono tracking-wider text-xs uppercase rounded-xl transition-all duration-300 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(192,193,255,0.3)] hover:shadow-[0_0_30px_rgba(192,193,255,0.5)] hover:scale-[1.01] active:scale-[0.98]"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-px-on-primary" />
                  Processing...
                </>
              ) : !originalFile ? (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Image to Start
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Process & Generate
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 3: RESULT CONTAINER (Fades in, shows conversion metadata and download option) */}
      <div ref={resultRef} className="relative z-10">
        <AnimatePresence>
          {showResult && resultUrl && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              id="result-section"
              className="mt-12 border-t border-px-outline-variant/20 pt-10"
            >
              <div className="flex flex-col items-center text-center mb-8">
                {/* Result Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-px-primary/10 text-px-primary rounded-full text-xs font-bold border border-px-primary/20 shadow-sm font-mono">
                  <CheckCircle className="w-4 h-4" />
                  Conversion Successful
                </div>
                <h2 className="text-3xl font-extrabold text-px-on-surface mt-3.5 tracking-tight">
                  Your image is ready
                </h2>
                <p className="text-sm text-px-on-surface-variant/70 max-w-md mt-1.5">
                  Rendered entirely inside your secure browser using client-side canvas acceleration.
                </p>
              </div>

              {/* Conversion Result Visual Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Left: Preview panel with clean transparent canvas grid */}
                <div className="bg-px-surface-container-low/40 border border-px-outline-variant/30 rounded-2xl p-3 shadow-xl flex items-center justify-center overflow-hidden">
                  {/* Grid / Dotted background container simulating transparent grid */}
                  <div 
                    className="aspect-video w-full rounded-xl flex items-center justify-center p-3 relative overflow-hidden shadow-inner border border-px-outline-variant/15"
                    style={{
                      backgroundColor: '#010f1f',
                      backgroundImage: 'radial-gradient(#273647 1px, transparent 1px)',
                      backgroundSize: '12px 12px'
                    }}
                  >
                    <img
                      src={resultUrl}
                      alt="Converted Output Preview"
                      className="max-h-full max-w-full object-contain rounded shadow-lg transition-transform hover:scale-[1.01] duration-300"
                    />
                  </div>
                </div>

                {/* Right: Metrics & Download Controls matching exact screenshot style */}
                <div className="flex flex-col space-y-6">
                  {/* Glass Metrics Card */}
                  <div className="bg-px-surface-container/40 border border-px-outline-variant/30 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
                    <div>
                      {/* New Size Metric Row */}
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-sm font-mono text-px-on-surface-variant/60 uppercase tracking-wider block">New Size</span>
                          <p className="text-3xl sm:text-4xl font-extrabold text-px-on-surface font-mono mt-2 tracking-tight">
                            {formatBytes(resultSize)}
                          </p>
                        </div>

                        {/* Percentage pill badge */}
                        <div 
                          className={`px-3 py-1.5 rounded-lg font-mono text-xs font-extrabold border flex items-center gap-1 mt-1
                            ${isReduced 
                              ? 'bg-px-primary-container/20 border-px-primary/40 text-px-primary' 
                              : 'bg-px-error-container/30 border-red-900/60 text-red-200'
                            }`}
                        >
                          {isReduced ? '-' : '+'} {percentageChange}%
                        </div>
                      </div>

                      {/* Progress visual indicator */}
                      <div className="mt-6">
                        <div className="w-full bg-px-surface-container-lowest h-1.5 rounded-full overflow-hidden border border-px-outline-variant/15 shadow-inner">
                          <motion.div 
                            className={`h-full rounded-full ${isReduced ? 'bg-px-primary' : 'bg-red-400'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, Math.max(8, (resultSize / originalSize) * 100))}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                        <div className="flex justify-between text-xs font-mono text-px-on-surface-variant/50 mt-3">
                          <span>Original: {formatBytes(originalSize)}</span>
                          <span>New: {formatBytes(resultSize)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="space-y-4 flex flex-col items-center">
                    <button
                      type="button"
                      id="btn-download-image"
                      onClick={handleDownload}
                      className="w-full py-4 px-6 bg-px-primary text-px-on-primary font-bold font-mono tracking-wider text-xs uppercase rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(192,193,255,0.45)] hover:scale-[1.01] active:scale-[0.98]"
                    >
                      <Download className="w-4 h-4 text-px-on-primary" />
                      Download Converted Image
                    </button>

                    <button
                      type="button"
                      id="btn-reset-project"
                      onClick={handleReset}
                      className="text-xs font-mono font-bold uppercase tracking-wider text-px-on-surface-variant/75 hover:text-px-primary transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-1 py-1 px-3 hover:bg-px-primary/5 rounded-lg"
                    >
                      <RefreshCw className="w-3.5 h-3.5 animate-spin-hover" />
                      Start New Project
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
