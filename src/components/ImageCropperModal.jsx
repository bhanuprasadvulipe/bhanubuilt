import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Check, Eye, Crop, Smartphone, Monitor } from 'lucide-react';
import './ImageCropperModal.css';

const ImageCropperModal = ({
  isOpen,
  onClose,
  imageSrc,
  sectionType, // 'hero' | 'profile'
  onSave,
  isSaving
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('crop'); // 'crop' | 'preview'
  const [previewDevice, setPreviewDevice] = useState('mobile'); // 'mobile' | 'desktop'
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadedSrc, setLoadedSrc] = useState(imageSrc);
  
  // Aspect ratio state (e.g. 4/5 for mobile hero/profile, 16/9 for desktop hero)
  const defaultRatio = sectionType === 'hero' ? 4 / 5 : 3 / 4;
  const [aspectRatio, setAspectRatio] = useState(defaultRatio);

  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const lastContainerSize = useRef({ width: 350, height: 437 });

  // Convert remote HTTP images to Blob URLs to avoid tainted canvas CORS issues
  useEffect(() => {
    let isMounted = true;
    if (imageSrc && imageSrc.startsWith('http')) {
      fetch(imageSrc, { mode: 'cors' })
        .then(res => res.blob())
        .then(blob => {
          if (isMounted) {
            const blobUrl = URL.createObjectURL(blob);
            setLoadedSrc(blobUrl);
          }
        })
        .catch(() => {
          if (isMounted) setLoadedSrc(imageSrc);
        });
    } else {
      setLoadedSrc(imageSrc);
    }
    return () => {
      isMounted = false;
    };
  }, [imageSrc]);

  // Reset state whenever new image is opened
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setActiveTab('crop');
      setIsProcessing(false);
      setAspectRatio(sectionType === 'hero' ? 4 / 5 : 3 / 4);
    }
  }, [isOpen, imageSrc, sectionType]);

  // Track container size when rendered
  useEffect(() => {
    if (containerRef.current) {
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      if (w > 0 && h > 0) {
        lastContainerSize.current = { width: w, height: h };
      }
    }
  }, [activeTab, aspectRatio]);

  // Touch handlers
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Mouse handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - pan.x,
      y: e.clientY - pan.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Generate cropped image using HTML5 Canvas with CORS protection & fallbacks
  const handleApplyCrop = async () => {
    if (isProcessing || isSaving) return;
    setIsProcessing(true);

    try {
      const img = imgRef.current;
      if (!img) {
        throw new Error('Image reference not available');
      }

      // High resolution target canvas
      const targetWidth = 1200;
      const targetHeight = Math.round(targetWidth / aspectRatio);

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Could not create canvas context');
      }

      // Background fill
      ctx.fillStyle = '#111111';
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      // Determine container metrics (fallback to last recorded size if in preview tab)
      const containerWidth = containerRef.current?.clientWidth || lastContainerSize.current.width || 350;
      const containerHeight = containerRef.current?.clientHeight || lastContainerSize.current.height || Math.round(350 / aspectRatio);

      const scaleFactor = targetWidth / containerWidth;

      const imgNaturalWidth = img.naturalWidth || 800;
      const imgNaturalHeight = img.naturalHeight || 600;

      const containerAspect = containerWidth / containerHeight;
      const imgAspect = imgNaturalWidth / imgNaturalHeight;

      let baseWidth, baseHeight;
      if (imgAspect > containerAspect) {
        baseHeight = containerHeight;
        baseWidth = baseHeight * imgAspect;
      } else {
        baseWidth = containerWidth;
        baseHeight = baseWidth / imgAspect;
      }

      const currentWidth = baseWidth * zoom * scaleFactor;
      const currentHeight = baseHeight * zoom * scaleFactor;

      const centerX = (targetWidth - currentWidth) / 2 + pan.x * scaleFactor;
      const centerY = (targetHeight - currentHeight) / 2 + pan.y * scaleFactor;

      ctx.drawImage(img, centerX, centerY, currentWidth, currentHeight);

      const blob = await new Promise((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.92);
      });

      if (blob) {
        await onSave(blob);
      } else {
        throw new Error('Canvas toBlob returned empty blob');
      }
    } catch (err) {
      console.warn('Canvas export failed, attempting direct image fallback:', err);
      // Fallback: If canvas export was restricted, fetch source as blob and save directly
      try {
        const res = await fetch(loadedSrc);
        const fallbackBlob = await res.blob();
        await onSave(fallbackBlob);
      } catch (fallbackErr) {
        console.error('Direct fallback failed:', fallbackErr);
        alert('Could not save image crop. Please try uploading the image directly.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  const title = sectionType === 'hero' ? 'Hero Section Image' : 'Profile Section Image';

  return (
    <div className="cropper-modal-overlay">
      <div className="cropper-modal-card">
        {/* Header */}
        <div className="cropper-header">
          <div>
            <h3>Adjust & Crop: {title}</h3>
            <p className="cropper-subtitle">
              Drag to position, pinch or use slider to zoom. Preview how it fits on the live site.
            </p>
          </div>
          <button type="button" className="cropper-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* View Switcher: Crop vs Live Preview */}
        <div className="cropper-tabs">
          <button 
            type="button" 
            className={`cropper-tab ${activeTab === 'crop' ? 'active' : ''}`}
            onClick={() => setActiveTab('crop')}
          >
            <Crop size={16} /> Crop & Adjust
          </button>
          <button 
            type="button" 
            className={`cropper-tab ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            <Eye size={16} /> Live Main Page Preview
          </button>
        </div>

        {/* Tab 1: Interactive Crop Tool - Kept in DOM so refs are always available */}
        <div className="cropper-body" style={{ display: activeTab === 'crop' ? 'flex' : 'none' }}>
          {/* Aspect ratio selector */}
          <div className="aspect-ratio-controls">
            <span className="control-label">Aspect Ratio:</span>
            {sectionType === 'hero' ? (
              <>
                <button 
                  type="button" 
                  className={`ratio-btn ${aspectRatio === 4 / 5 ? 'active' : ''}`}
                  onClick={() => setAspectRatio(4 / 5)}
                >
                  4:5 Mobile Portrait
                </button>
                <button 
                  type="button" 
                  className={`ratio-btn ${aspectRatio === 16 / 9 ? 'active' : ''}`}
                  onClick={() => setAspectRatio(16 / 9)}
                >
                  16:9 Desktop Wide
                </button>
              </>
            ) : (
              <>
                <button 
                  type="button" 
                  className={`ratio-btn ${aspectRatio === 3 / 4 ? 'active' : ''}`}
                  onClick={() => setAspectRatio(3 / 4)}
                >
                  3:4 Portrait (Recommended)
                </button>
                <button 
                  type="button" 
                  className={`ratio-btn ${aspectRatio === 1 ? 'active' : ''}`}
                  onClick={() => setAspectRatio(1)}
                >
                  1:1 Square
                </button>
              </>
            )}
          </div>

          {/* Viewport Frame with Aspect Ratio */}
          <div className="cropper-canvas-wrapper">
            <div 
              className="cropper-viewport"
              ref={containerRef}
              style={{ aspectRatio: `${aspectRatio}` }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Guidelines grid */}
              <div className="cropper-grid-overlay" pointerEvents="none">
                <div className="grid-line horizontal top"></div>
                <div className="grid-line horizontal bottom"></div>
                <div className="grid-line vertical left"></div>
                <div className="grid-line vertical right"></div>
              </div>

              <img 
                ref={imgRef}
                src={loadedSrc} 
                alt="Crop preview"
                className="cropper-target-img"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  cursor: isDragging ? 'grabbing' : 'grab'
                }}
                crossOrigin="anonymous"
                draggable={false}
              />
            </div>

            <span className="cropper-drag-hint">👆 Drag photo to move | Use slider below to zoom</span>
          </div>

          {/* Zoom & Adjustment Controls */}
          <div className="cropper-controls-panel">
            <div className="zoom-slider-row">
              <button 
                type="button" 
                className="icon-btn" 
                onClick={() => setZoom(prev => Math.max(1, prev - 0.1))}
                aria-label="Zoom out"
              >
                <ZoomOut size={18} />
              </button>
              <input 
                type="range" 
                min="1" 
                max="3" 
                step="0.05"
                value={zoom} 
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="zoom-slider"
              />
              <button 
                type="button" 
                className="icon-btn" 
                onClick={() => setZoom(prev => Math.min(3, prev + 0.1))}
                aria-label="Zoom in"
              >
                <ZoomIn size={18} />
              </button>
              <span className="zoom-value">{Math.round(zoom * 100)}%</span>
            </div>

            <div className="adjust-actions-row">
              <button type="button" className="btn btn-outline btn-sm" onClick={handleReset}>
                <RotateCcw size={14} /> Center & Reset
              </button>
            </div>
          </div>
        </div>

        {/* Tab 2: Live Mockup of Main Page */}
        <div className="cropper-preview-body" style={{ display: activeTab === 'preview' ? 'flex' : 'none' }}>
          <div className="preview-device-toggle">
            <span className="control-label">Preview Mode:</span>
            <button 
              type="button" 
              className={`device-btn ${previewDevice === 'mobile' ? 'active' : ''}`}
              onClick={() => setPreviewDevice('mobile')}
            >
              <Smartphone size={16} /> Mobile View
            </button>
            <button 
              type="button" 
              className={`device-btn ${previewDevice === 'desktop' ? 'active' : ''}`}
              onClick={() => setPreviewDevice('desktop')}
            >
              <Monitor size={16} /> Desktop View
            </button>
          </div>

          {sectionType === 'hero' ? (
            /* Live Hero Section Mockup */
            <div className={`live-mockup-container hero-mockup ${previewDevice}`}>
              <div className="mockup-screen">
                {/* Left Hero Content */}
                <div className="mockup-hero-content">
                  <span className="mockup-badge">Online Personal Training</span>
                  <h2>Redesign the way <span>You Look</span></h2>
                  <p>Transform your body with custom training and nutrition plans by Bhanu.</p>
                  <div className="mockup-buttons">
                    <span className="mockup-btn-primary">Start Your Journey →</span>
                  </div>
                </div>

                {/* Right Hero Image with exact fade mask */}
                <div className="mockup-hero-image-wrap">
                  <img 
                    src={loadedSrc} 
                    alt="Hero live simulation"
                    style={{
                      transform: `translate(${pan.x / 2}px, ${pan.y / 2}px) scale(${zoom})`
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Live Profile Section Mockup */
            <div className={`live-mockup-container profile-mockup ${previewDevice}`}>
              <div className="mockup-screen profile-layout">
                <div className="mockup-profile-image-wrap">
                  <img 
                    src={loadedSrc} 
                    alt="Profile live simulation"
                    style={{
                      transform: `translate(${pan.x / 2}px, ${pan.y / 2}px) scale(${zoom})`
                    }}
                  />
                  <div className="mockup-exp-badge">
                    <span className="mockup-exp-years">7+</span>
                    <span className="mockup-exp-text">Years<br/>Experience</span>
                  </div>
                </div>
                <div className="mockup-profile-content">
                  <h3>Meet <span>Bhanu Prasad Vulipe</span></h3>
                  <p>Certified fitness coach & transformation specialist based in Hyderabad.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="cropper-footer">
          <button type="button" className="btn btn-outline" onClick={onClose} disabled={isProcessing || isSaving}>
            Cancel
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handleApplyCrop} 
            disabled={isProcessing || isSaving}
          >
            {isProcessing || isSaving ? (
              'Applying & Saving...'
            ) : (
              <>
                <Check size={18} /> Apply & Save to Live Site
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
