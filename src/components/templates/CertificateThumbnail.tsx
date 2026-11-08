import React from 'react';
import { CertificateTemplate } from '../../types/certificate';
import { CertificateBadge, CertificateBorderRenderer } from '../canvas/VectorAssets';

interface CertificateThumbnailProps {
  template: CertificateTemplate;
  className?: string;
  onClick?: () => void;
}

export const CertificateThumbnail: React.FC<CertificateThumbnailProps> = ({
  template,
  className = '',
  onClick
}) => {
  const isLandscape = template.orientation === 'landscape';
  const width = template.width || (isLandscape ? 1123 : 794);
  const height = template.height || (isLandscape ? 794 : 1123);

  // Find key elements to render lightweight representation
  const titleEl = template.elements.find(el => el.type === 'text' && (el.fontSize || 16) >= 22);
  const recipientEl = template.elements.find(el => el.placeholderKey === 'RECIPIENT_NAME' || (el.type === 'text' && (el.fontSize || 16) >= 30 && el !== titleEl));
  const orgEl = template.elements.find(el => el.placeholderKey === 'ORGANIZATION_NAME' || (el.type === 'text' && (el.fontSize || 16) <= 20 && el.y < 120));
  const badgeEl = template.elements.find(el => el.type === 'badge');

  return (
    <div
      onClick={onClick}
      className={`relative w-full h-full select-none overflow-hidden rounded-lg shadow-sm transition-transform duration-200 ${className}`}
      style={{
        backgroundColor: template.background.color || '#FFFFFF',
        aspectRatio: `${width} / ${height}`
      }}
    >
      {/* SVG Canvas for Borders and Vector Elements */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full absolute inset-0 pointer-events-none"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background parchment tint if applicable */}
        {template.background.patternType === 'parchment' && (
          <rect
            width={width}
            height={height}
            fill="#8B5A2B"
            opacity={template.background.patternOpacity || 0.05}
          />
        )}

        {/* Decorative Border */}
        <CertificateBorderRenderer
          style={template.border.style}
          color={template.border.color}
          secondaryColor={template.border.secondaryColor}
          width={template.border.width}
          inset={template.border.inset}
          canvasWidth={width}
          canvasHeight={height}
        />

        {/* Top Organization Header */}
        {orgEl && (
          <text
            x={width / 2}
            y={orgEl.y + (isLandscape ? 24 : 20)}
            fill={orgEl.color || template.border.color}
            fontFamily={orgEl.fontFamily || 'Cinzel'}
            fontSize={orgEl.fontSize || 18}
            fontWeight="700"
            letterSpacing={orgEl.letterSpacing || 3}
            textAnchor="middle"
          >
            {orgEl.content?.replace('[ORGANIZATION_NAME]', 'ACADEMY OF EXCELLENCE')}
          </text>
        )}

        {/* Main Certificate Heading */}
        {titleEl && (
          <text
            x={width / 2}
            y={titleEl.y + (isLandscape ? 36 : 30)}
            fill={titleEl.color || '#0F172A'}
            fontFamily={titleEl.fontFamily || 'Cinzel'}
            fontSize={titleEl.fontSize || 28}
            fontWeight="800"
            letterSpacing={titleEl.letterSpacing || 2}
            textAnchor="middle"
          >
            {titleEl.content}
          </text>
        )}

        {/* Presentation subtitle indicator */}
        <text
          x={width / 2}
          y={(titleEl ? titleEl.y + 65 : height / 2 - 40)}
          fill="#64748B"
          fontFamily="Plus Jakarta Sans"
          fontSize={12}
          fontWeight="600"
          letterSpacing={3}
          textAnchor="middle"
        >
          PROUDLY CONFERRED UPON
        </text>

        {/* Recipient Name Highlight */}
        {recipientEl && (
          <text
            x={width / 2}
            y={recipientEl.y + (isLandscape ? 45 : 38)}
            fill={recipientEl.color || '#1E40AF'}
            fontFamily={recipientEl.fontFamily || 'Playfair Display'}
            fontSize={recipientEl.fontSize || 40}
            fontWeight="700"
            textAnchor="middle"
          >
            {recipientEl.content?.replace('[RECIPIENT_NAME]', 'Muhammad Ali')}
          </text>
        )}

        {/* Decorative divider line under name */}
        <line
          x1={width / 2 - (isLandscape ? 200 : 150)}
          y1={(recipientEl ? recipientEl.y + (isLandscape ? 60 : 50) : height / 2 + 30)}
          x2={width / 2 + (isLandscape ? 200 : 150)}
          y2={(recipientEl ? recipientEl.y + (isLandscape ? 60 : 50) : height / 2 + 30)}
          stroke={template.border.color}
          strokeWidth={2}
          strokeDasharray={template.border.style === 'minimal' ? 'none' : '4,2'}
          opacity={0.6}
        />

        {/* Signature lines */}
        <g opacity={0.7}>
          <line
            x1={isLandscape ? 140 : 80}
            y1={height - (isLandscape ? 140 : 160)}
            x2={isLandscape ? 340 : 260}
            y2={height - (isLandscape ? 140 : 160)}
            stroke={template.border.color}
            strokeWidth={1}
          />
          <text
            x={isLandscape ? 240 : 170}
            y={height - (isLandscape ? 120 : 140)}
            fill="#64748B"
            fontSize={11}
            fontFamily="Plus Jakarta Sans"
            textAnchor="middle"
            letterSpacing={1}
          >
            AUTHORIZED SIGNATURE
          </text>

          <line
            x1={width - (isLandscape ? 340 : 260)}
            y1={height - (isLandscape ? 140 : 160)}
            x2={width - (isLandscape ? 140 : 80)}
            y2={height - (isLandscape ? 140 : 160)}
            stroke={template.border.color}
            strokeWidth={1}
          />
          <text
            x={width - (isLandscape ? 240 : 170)}
            y={height - (isLandscape ? 120 : 140)}
            fill="#64748B"
            fontSize={11}
            fontFamily="Plus Jakarta Sans"
            textAnchor="middle"
            letterSpacing={1}
          >
            DATE & SEAL
          </text>
        </g>
      </svg>

      {/* Decorative Badge Overlay (Centered Bottom) */}
      {badgeEl && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${(badgeEl.x / width) * 100}%`,
            top: `${(badgeEl.y / height) * 100}%`,
            width: `${(badgeEl.width / width) * 100}%`,
            height: `${(badgeEl.height / height) * 100}%`
          }}
        >
          <CertificateBadge
            type={badgeEl.badgeType || 'gold-seal'}
            fill={badgeEl.fill}
            stroke={badgeEl.stroke}
            width={badgeEl.width || 80}
            height={badgeEl.height || 80}
          />
        </div>
      )}
    </div>
  );
};
