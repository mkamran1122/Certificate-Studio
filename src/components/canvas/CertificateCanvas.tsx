import React, { useRef, useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { CertificateElement, BackgroundSettings, BorderSettings } from '../../types/certificate';
import { CertificateBadge, CertificateBorderRenderer } from './VectorAssets';

interface CertificateCanvasProps {
  width: number;
  height: number;
  background: BackgroundSettings;
  border: BorderSettings;
  elements: CertificateElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<CertificateElement>) => void;
  onDragEnd?: () => void;
  scale?: number;
  readOnly?: boolean;
  domRef?: React.RefObject<HTMLDivElement | null>;
}

export const CertificateCanvas: React.FC<CertificateCanvasProps> = ({
  width,
  height,
  background,
  border,
  elements,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onDragEnd,
  scale = 1,
  readOnly = false,
  domRef
}) => {
  const [qrCache, setQrCache] = useState<Record<string, string>>({});
  const [guideV, setGuideV] = useState(false);
  const [guideH, setGuideH] = useState(false);
  const [dragState, setDragState] = useState<{
    id: string;
    mode: 'move' | 'resize' | 'rotate';
    handle?: string;
    startX: number;
    startY: number;
    startElemX: number;
    startElemY: number;
    startElemW: number;
    startElemH: number;
    startRotation: number;
  } | null>(null);

  // Generate QR code data URLs for elements with type 'qr'
  useEffect(() => {
    elements.forEach(async el => {
      if (el.type === 'qr' && el.qrValue) {
        const cacheKey = `${el.qrValue}_${el.qrColor || '#000000'}_${el.qrBgColor || '#FFFFFF'}`;
        if (!qrCache[cacheKey]) {
          try {
            const url = await QRCode.toDataURL(el.qrValue, {
              color: {
                dark: el.qrColor || '#000000',
                light: el.qrBgColor || '#00000000'
              },
              margin: 1,
              width: Math.max(128, el.width * 2)
            });
            setQrCache(prev => ({ ...prev, [cacheKey]: url }));
          } catch (e) {
            console.error('QR code generation failed', e);
          }
        }
      }
    });
  }, [elements, qrCache]);

  const selectedElem = elements.find(el => el.id === selectedElementId);

  // Mouse / Pointer movement handlers
  const handlePointerDown = (
    e: React.PointerEvent,
    id: string,
    mode: 'move' | 'resize' | 'rotate',
    handle?: string
  ) => {
    if (readOnly) return;
    const el = elements.find(item => item.id === id);
    if (!el || el.locked) return;

    e.stopPropagation();
    onSelectElement(id);

    setDragState({
      id,
      mode,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startElemX: el.x,
      startElemY: el.y,
      startElemW: el.width,
      startElemH: el.height,
      startRotation: el.rotation || 0
    });
  };

  useEffect(() => {
    if (!dragState) return;

    const handlePointerMove = (e: PointerEvent) => {
      const dx = (e.clientX - dragState.startX) / scale;
      const dy = (e.clientY - dragState.startY) / scale;

      if (dragState.mode === 'move') {
        let newX = Math.round(dragState.startElemX + dx);
        let newY = Math.round(dragState.startElemY + dy);

        // Alignment guides & center snapping
        const canvasCenterX = width / 2;
        const canvasCenterY = height / 2;
        const elemCenterX = newX + dragState.startElemW / 2;
        const elemCenterY = newY + dragState.startElemH / 2;

        if (Math.abs(elemCenterX - canvasCenterX) <= 7) {
          newX = Math.round(canvasCenterX - dragState.startElemW / 2);
          setGuideV(true);
        } else {
          setGuideV(false);
        }

        if (Math.abs(elemCenterY - canvasCenterY) <= 7) {
          newY = Math.round(canvasCenterY - dragState.startElemH / 2);
          setGuideH(true);
        } else {
          setGuideH(false);
        }

        onUpdateElement(dragState.id, { x: newX, y: newY });
      } else if (dragState.mode === 'resize') {
        let newX = dragState.startElemX;
        let newY = dragState.startElemY;
        let newW = dragState.startElemW;
        let newH = dragState.startElemH;
        const handle = dragState.handle || 'se';

        if (handle.includes('e')) newW = Math.max(20, Math.round(dragState.startElemW + dx));
        if (handle.includes('s')) newH = Math.max(16, Math.round(dragState.startElemH + dy));
        if (handle.includes('w')) {
          const proposedW = Math.max(20, Math.round(dragState.startElemW - dx));
          newX = dragState.startElemX + (dragState.startElemW - proposedW);
          newW = proposedW;
        }
        if (handle.includes('n')) {
          const proposedH = Math.max(16, Math.round(dragState.startElemH - dy));
          newY = dragState.startElemY + (dragState.startElemH - proposedH);
          newH = proposedH;
        }

        onUpdateElement(dragState.id, { x: newX, y: newY, width: newW, height: newH });
      } else if (dragState.mode === 'rotate') {
        const elCenterX = dragState.startElemX + dragState.startElemW / 2;
        const elCenterY = dragState.startElemY + dragState.startElemH / 2;
        const currentMouseX = dragState.startElemX + dx;
        const currentMouseY = dragState.startElemY + dy;
        const angleRad = Math.atan2(currentMouseY - elCenterY, currentMouseX - elCenterX);
        let angleDeg = Math.round((angleRad * 180) / Math.PI + 90);
        if (angleDeg < 0) angleDeg += 360;
        // Snap to 0, 90, 180, 270 if close
        if (Math.abs(angleDeg % 90) < 3 || Math.abs((angleDeg % 90) - 90) < 3) {
          angleDeg = Math.round(angleDeg / 90) * 90;
        }
        onUpdateElement(dragState.id, { rotation: angleDeg % 360 });
      }
    };

    const handlePointerUp = () => {
      setGuideV(false);
      setGuideH(false);
      onDragEnd?.();
      setDragState(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragState, onUpdateElement, scale, width, height, onDragEnd]);

  // Background pattern SVG definitions
  const renderBackgroundPattern = () => {
    if (background.type === 'pattern' || background.patternType) {
      if (background.patternType === 'parchment') {
        return (
          <rect
            width={width}
            height={height}
            fill="#8B5A2B"
            opacity={background.patternOpacity || 0.04}
            className="pointer-events-none mix-blend-multiply"
          />
        );
      }
    }
    return null;
  };

  return (
    <div
      ref={domRef}
      id="certificate-canvas-root"
      className="relative select-none shadow-2xl transition-all"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        backgroundColor: background.color || '#FFFFFF',
        overflow: 'hidden'
      }}
      onClick={(e) => {
        if (!readOnly && e.target === e.currentTarget) {
          onSelectElement(null);
        }
      }}
    >
      {/* Background patterns and borders */}
      <svg
        width={width}
        height={height}
        className="absolute inset-0 pointer-events-none"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {renderBackgroundPattern()}
        <CertificateBorderRenderer
          style={border.style}
          color={border.color}
          secondaryColor={border.secondaryColor}
          width={border.width}
          inset={border.inset}
          canvasWidth={width}
          canvasHeight={height}
        />
      </svg>

      {/* Render all elements */}
      {elements
        .filter(el => !el.hidden)
        .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
        .map(el => {
          const isSelected = !readOnly && el.id === selectedElementId;
          const qrKey = `${el.qrValue}_${el.qrColor || '#000000'}_${el.qrBgColor || '#FFFFFF'}`;

          return (
            <div
              key={el.id}
              data-element-id={el.id}
              className={`absolute cursor-move transition-[box-shadow] ${
                isSelected ? 'ring-2 ring-blue-500 ring-offset-1 z-50' : 'hover:ring-1 hover:ring-blue-300/60'
              }`}
              style={{
                left: `${el.x}px`,
                top: `${el.y}px`,
                width: `${el.width}px`,
                height: `${el.height}px`,
                transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                transformOrigin: 'center center',
                opacity: el.opacity ?? 1,
                userSelect: 'none'
              }}
              onPointerDown={(e) => handlePointerDown(e, el.id, 'move')}
              onClick={(e) => {
                e.stopPropagation();
                if (!readOnly) onSelectElement(el.id);
              }}
            >
              {/* Text Element */}
              {el.type === 'text' && (
                <div
                  className="w-full h-full flex flex-col justify-center leading-snug whitespace-pre-wrap break-words"
                  style={{
                    fontFamily: el.fontFamily ? `'${el.fontFamily}', serif` : 'inherit',
                    fontSize: `${el.fontSize || 16}px`,
                    fontWeight: el.fontWeight || 'normal',
                    fontStyle: el.fontStyle || 'normal',
                    color: el.color || '#000000',
                    textAlign: el.textAlign || 'center',
                    letterSpacing: el.letterSpacing ? `${el.letterSpacing}px` : undefined,
                    lineHeight: el.lineHeight || 1.3,
                    textTransform: el.textTransform || 'none'
                  }}
                >
                  {el.content}
                </div>
              )}

              {/* Badge Element */}
              {el.type === 'badge' && (
                <div className="w-full h-full flex items-center justify-center">
                  <CertificateBadge
                    type={el.badgeType || 'gold-seal'}
                    fill={el.fill}
                    stroke={el.stroke}
                    width={el.width}
                    height={el.height}
                  />
                </div>
              )}

              {/* Line / Divider Element */}
              {el.type === 'line' && (
                <div className="w-full h-full flex items-center">
                  <div
                    className="w-full"
                    style={{
                      height: `${el.strokeWidth || 2}px`,
                      backgroundColor: el.stroke || '#000000',
                      borderStyle: el.strokeDasharray ? 'dashed' : 'solid'
                    }}
                  />
                </div>
              )}

              {/* Shape Element */}
              {el.type === 'shape' && (
                <div
                  className="w-full h-full"
                  style={{
                    backgroundColor: el.fill || '#CBD5E1',
                    border: el.stroke ? `${el.strokeWidth || 1}px solid ${el.stroke}` : undefined,
                    borderRadius:
                      el.shapeKind === 'circle'
                        ? '50%'
                        : el.borderRadius
                        ? `${el.borderRadius}px`
                        : undefined
                  }}
                />
              )}

              {/* QR Code Element */}
              {el.type === 'qr' && (
                <div className="w-full h-full flex items-center justify-center bg-white p-1 rounded-sm shadow-sm">
                  {qrCache[qrKey] ? (
                    <img
                      src={qrCache[qrKey]}
                      alt="Verification QR Code"
                      className="w-full h-full object-contain pointer-events-none"
                    />
                  ) : (
                    <div className="text-[10px] text-slate-400 font-mono">QR Loading</div>
                  )}
                </div>
              )}

              {/* Image / Signature / Logo Element */}
              {el.type === 'image' && (
                <div className="w-full h-full flex items-center justify-center overflow-hidden">
                  {el.src ? (
                    <img
                      src={el.src}
                      alt="Uploaded Asset"
                      className="w-full h-full object-contain pointer-events-none"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 dark:bg-slate-800 border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400">
                      Empty Image
                    </div>
                  )}
                </div>
              )}

              {/* Resize & Rotate handles when selected */}
              {isSelected && !el.locked && (
                <>
                  {/* Bounding box handles */}
                  {['nw', 'ne', 'se', 'sw', 'n', 's', 'e', 'w'].map(handle => {
                    let positionClasses = '';
                    if (handle === 'nw') positionClasses = '-top-1.5 -left-1.5 cursor-nwse-resize';
                    if (handle === 'ne') positionClasses = '-top-1.5 -right-1.5 cursor-nesw-resize';
                    if (handle === 'se') positionClasses = '-bottom-1.5 -right-1.5 cursor-nwse-resize';
                    if (handle === 'sw') positionClasses = '-bottom-1.5 -left-1.5 cursor-nesw-resize';
                    if (handle === 'n') positionClasses = '-top-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize';
                    if (handle === 's') positionClasses = '-bottom-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize';
                    if (handle === 'e') positionClasses = 'top-1/2 -right-1.5 -translate-y-1/2 cursor-ew-resize';
                    if (handle === 'w') positionClasses = 'top-1/2 -left-1.5 -translate-y-1/2 cursor-ew-resize';

                    return (
                      <div
                        key={handle}
                        className={`absolute w-3 h-3 bg-white border-2 border-blue-600 rounded-sm shadow-sm z-50 ${positionClasses}`}
                        onPointerDown={(e) => handlePointerDown(e, el.id, 'resize', handle)}
                      />
                    );
                  })}

                  {/* Rotate handle */}
                  <div
                    className="absolute -top-7 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-blue-600 rounded-full cursor-grab shadow-sm flex items-center justify-center z-50"
                    onPointerDown={(e) => handlePointerDown(e, el.id, 'rotate')}
                    title="Rotate element"
                  >
                    <div className="w-1 h-1 bg-blue-600 rounded-full" />
                  </div>
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-[1px] h-3 bg-blue-500 pointer-events-none" />
                </>
              )}
            </div>
          );
        })}

      {/* Alignment Center Guides */}
      {guideV && (
        <div
          className="absolute top-0 bottom-0 pointer-events-none z-50 border-l border-dashed border-blue-500 shadow-xs"
          style={{ left: `${width / 2}px` }}
        >
          <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-mono font-bold absolute top-2 -translate-x-1/2 shadow-xs">
            Center X
          </span>
        </div>
      )}
      {guideH && (
        <div
          className="absolute left-0 right-0 pointer-events-none z-50 border-t border-dashed border-blue-500 shadow-xs"
          style={{ top: `${height / 2}px` }}
        >
          <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-mono font-bold absolute left-2 -translate-y-1/2 shadow-xs">
            Center Y
          </span>
        </div>
      )}
    </div>
  );
};
