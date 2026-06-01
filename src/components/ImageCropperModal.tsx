import React, { useState, useEffect, useRef, MouseEvent, TouchEvent } from "react";
import { X, ZoomIn, ZoomOut, RotateCw, Check, Crop } from "lucide-react";

interface ImageCropperModalProps {
  imageSrc: string;
  fileName: string;
  defaultAspect?: number; // 1 for square, 1.777 (16/9) for wide, etc.
  onCrop: (croppedFile: File) => void;
  onClose: () => void;
}

type AspectRatioOption = {
  label: string;
  value: number | "free";
};

export default function ImageCropperModal({
  imageSrc,
  fileName,
  defaultAspect = 1,
  onCrop,
  onClose
}: ImageCropperModalProps) {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedAspect, setSelectedAspect] = useState<number | "free">(defaultAspect);
  
  // Dimensions of workspace & viewport
  const wsWidth = 340;
  const wsHeight = 340;
  const [viewportSize, setViewportSize] = useState({ w: 240, h: 240 });
  
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Calculate viewport size based on aspect ratio preset
  useEffect(() => {
    if (!imageLoaded || !imgRef.current) return;

    let w = 240;
    let h = 240;

    if (selectedAspect === "free") {
      // For free aspect ratio, match image's natural aspect ratio within bounds
      const imgAspect = imgRef.current.naturalWidth / imgRef.current.naturalHeight;
      if (imgAspect > 1) {
        w = 240;
        h = 240 / imgAspect;
      } else {
        h = 240;
        w = 240 * imgAspect;
      }
    } else {
      const aspect = selectedAspect;
      if (aspect > 1) {
        w = 260;
        h = 260 / aspect;
        if (h > 240) {
          h = 240;
          w = 240 * aspect;
        }
      } else {
        h = 260;
        w = 260 * aspect;
        if (w > 240) {
          w = 240;
          h = 240 / aspect;
        }
      }
    }

    setViewportSize({ w: Math.round(w), h: Math.round(h) });
    // Reset zoom and positions on aspect ratio change
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [selectedAspect, imageLoaded]);

  // Swapped sizes if rotated sideways
  const isSideways = rotation === 90 || rotation === 270;

  // Base scale calculation to make image cover the viewport
  const getBaseScale = () => {
    if (!imgRef.current) return 1;
    const W_img = isSideways ? imgRef.current.naturalHeight : imgRef.current.naturalWidth;
    const H_img = isSideways ? imgRef.current.naturalWidth : imgRef.current.naturalHeight;
    
    const wRatio = viewportSize.w / W_img;
    const hRatio = viewportSize.h / H_img;
    
    // Cover the viewport
    return Math.max(wRatio, hRatio);
  };

  // Limit position so image cannot be dragged past viewport boundaries
  const limitPosition = (x: number, y: number, currentZoom: number) => {
    if (!imgRef.current) return { x, y };
    
    const W_img = isSideways ? imgRef.current.naturalHeight : imgRef.current.naturalWidth;
    const H_img = isSideways ? imgRef.current.naturalWidth : imgRef.current.naturalHeight;
    
    const baseScale = getBaseScale();
    const W_r = W_img * baseScale * currentZoom;
    const H_r = H_img * baseScale * currentZoom;
    
    const max_x = Math.max(0, (W_r - viewportSize.w) / 2);
    const max_y = Math.max(0, (H_r - viewportSize.h) / 2);
    
    return {
      x: Math.max(-max_x, Math.min(max_x, x)),
      y: Math.max(-max_y, Math.min(max_y, y))
    };
  };

  // Update position with current limits
  const handlePositionChange = (x: number, y: number) => {
    const limited = limitPosition(x, y, zoom);
    setPosition(limited);
  };

  // Drag Handlers
  const handleStart = (clientX: number, clientY: number) => {
    isDragging.current = true;
    dragStart.current = {
      x: clientX - position.x,
      y: clientY - position.y
    };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging.current) return;
    const newX = clientX - dragStart.current.x;
    const newY = clientY - dragStart.current.y;
    handlePositionChange(newX, newY);
  };

  const handleEnd = () => {
    isDragging.current = false;
  };

  // Zoom Handler
  const handleZoomChange = (newZoom: number) => {
    const nextZoom = Math.max(1, Math.min(3, newZoom));
    setZoom(nextZoom);
    // Re-limit position with new zoom
    const limited = limitPosition(position.x, position.y, nextZoom);
    setPosition(limited);
  };

  // Rotate Handler
  const handleRotate = () => {
    setRotation(prev => {
      const next = (prev + 90) % 360;
      // Adjust position to limits under new rotation
      setTimeout(() => {
        // Trigger a tiny adjustment using the next rotation logic
        setRotation(next);
      }, 0);
      return prev; // Handled in state change below
    });
  };

  // Handle adjustments after rotation changes
  useEffect(() => {
    if (imageLoaded) {
      const limited = limitPosition(position.x, position.y, zoom);
      setPosition(limited);
    }
  }, [rotation]);

  // Crop & Generate File
  const handleCropClick = () => {
    if (!imgRef.current) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W_img = imgRef.current.naturalWidth;
    const H_img = imgRef.current.naturalHeight;

    const baseScale = getBaseScale();
    const scaleRatio = baseScale * zoom;

    // Calculate cropped dimensions in original image pixels
    const cropWidth = viewportSize.w / scaleRatio;
    const cropHeight = viewportSize.h / scaleRatio;

    // Set canvas dimensions to match the original image's natural cropped resolution.
    // This yields pixel-perfect, lossless cropping without downscaling degradation!
    canvas.width = Math.round(cropWidth);
    canvas.height = Math.round(cropHeight);

    // Draw background (transparent)
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    // 1. Center context inside the high-resolution output canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // 2. Rotate canvas context if rotated by user
    ctx.rotate((rotation * Math.PI) / 180);
    
    // 3. Translate by dragged offset in original image pixels
    const dragOffsetOriginalX = position.x / scaleRatio;
    const dragOffsetOriginalY = position.y / scaleRatio;
    ctx.translate(dragOffsetOriginalX, dragOffsetOriginalY);
    
    // 4. Draw the original image centered at 1:1 scale (no pixel compression loss!)
    ctx.drawImage(imgRef.current, -W_img / 2, -H_img / 2);
    ctx.restore();

    // Export as File
    canvas.toBlob(blob => {
      if (!blob) return;
      const croppedFile = new File([blob], fileName, {
        type: blob.type || "image/jpeg",
        lastModified: Date.now()
      });
      onCrop(croppedFile);
    }, "image/jpeg", 0.95); // Export at high quality (95%)
  };

  // Aspect ratio presets
  const aspectOptions: AspectRatioOption[] = [
    { label: "1:1 Square", value: 1 },
    { label: "16:9 Landscape", value: 16 / 9 },
    { label: "4:3 Classic", value: 4 / 3 },
    { label: "3:4 Portrait", value: 3 / 4 },
    { label: "Free", value: "free" }
  ];

  // SVG mask positioning
  const maskX = (wsWidth - viewportSize.w) / 2;
  const maskY = (wsHeight - viewportSize.h) / 2;

  const baseScale = getBaseScale();

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-start md:items-center overflow-y-auto p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-sm my-auto overflow-hidden flex flex-col max-h-none">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
              <Crop className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Crop Your Image</h3>
              <p className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">{fileName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-xl transition-colors text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cropper Workspace */}
        <div className="p-6 flex flex-col items-center justify-center bg-slate-900 border-b border-slate-800">
          <div 
            className="relative overflow-hidden rounded-2xl bg-slate-950 shadow-inner select-none touch-none cursor-move"
            style={{ width: wsWidth, height: wsHeight }}
            onMouseDown={e => handleStart(e.clientX, e.clientY)}
            onMouseMove={e => handleMove(e.clientX, e.clientY)}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={e => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={e => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={handleEnd}
          >
            {/* The Image */}
            <img
              ref={imgRef}
              src={imageSrc}
              alt="To Crop"
              className="absolute left-1/2 top-1/2 max-w-none pointer-events-none origin-center"
              style={{
                transform: `translate3d(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px), 0) scale(${baseScale * zoom}) rotate(${rotation}deg)`,
                opacity: imageLoaded ? 1 : 0,
                transition: isDragging.current ? "none" : "transform 0.15s ease-out, opacity 0.3s ease"
              }}
              onLoad={() => setImageLoaded(true)}
            />

            {/* Rule-of-Thirds Grid Overlay (Faded overlay inside crop frame) */}
            <div 
              className={`absolute pointer-events-none border border-white/40 shadow-[0_0_0_9999px_rgba(15,23,42,0.7)] transition-all duration-300 ${
                selectedAspect === 1 ? "rounded-full" : "rounded-2xl"
              }`}
              style={{
                left: maskX,
                top: maskY,
                width: viewportSize.w,
                height: viewportSize.h
              }}
            >
              {/* Gridlines - only show for non-circular (non-1:1) crops */}
              {selectedAspect !== 1 && (
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30">
                  <div className="border-r border-b border-white"></div>
                  <div className="border-r border-b border-white"></div>
                  <div className="border-b border-white"></div>
                  <div className="border-r border-b border-white"></div>
                  <div className="border-r border-b border-white"></div>
                  <div className="border-b border-white"></div>
                  <div className="border-r border-white"></div>
                  <div className="border-r border-white"></div>
                  <div></div>
                </div>
              )}
            </div>

            {/* Loading Indicator */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center text-white/50 text-xs font-mono">
                Loading image...
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 space-y-5 bg-white">
          
          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <button onClick={() => handleZoomChange(zoom - 0.2)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
              <ZoomOut className="w-4 h-4" />
            </button>
            <input
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={zoom}
              onChange={e => handleZoomChange(parseFloat(e.target.value))}
              className="flex-grow h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
            <button onClick={() => handleZoomChange(zoom + 0.2)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Preset Aspect Ratios */}
          <div>
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Aspect Ratio</label>
            <div className="flex flex-wrap gap-1.5">
              {aspectOptions.map(opt => {
                const active = selectedAspect === opt.value;
                return (
                  <button
                    key={opt.label}
                    onClick={() => setSelectedAspect(opt.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      active 
                        ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" 
                        : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleRotate}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-600 hover:bg-slate-50 transition-colors flex-1"
            >
              <RotateCw className="w-3.5 h-3.5" /> Rotate 90°
            </button>
            
            <button
              onClick={handleCropClick}
              disabled={!imageLoaded}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-teal-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-teal-600 shadow-lg shadow-teal-500/10 disabled:opacity-50 transition-all flex-1"
            >
              <Check className="w-4 h-4" /> Crop & Apply
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
