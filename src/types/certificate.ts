export type PageOrientation = 'landscape' | 'portrait';
export type PageFormat = 'A4' | 'Letter' | 'Custom';

export interface PageDimension {
  width: number;
  height: number;
  label: string;
  dpi: number;
}

export const PAGE_SIZES: Record<string, { landscape: PageDimension; portrait: PageDimension }> = {
  A4: {
    landscape: { width: 1123, height: 794, label: 'A4 Landscape (297 × 210 mm)', dpi: 96 },
    portrait: { width: 794, height: 1123, label: 'A4 Portrait (210 × 297 mm)', dpi: 96 }
  },
  Letter: {
    landscape: { width: 1100, height: 850, label: 'US Letter Landscape (11 × 8.5 in)', dpi: 96 },
    portrait: { width: 850, height: 1100, label: 'US Letter Portrait (8.5 × 11 in)', dpi: 96 }
  }
};

export type ElementType = 'text' | 'shape' | 'badge' | 'image' | 'qr' | 'line' | 'border';

export type ShapeKind = 'rectangle' | 'circle' | 'divider' | 'ribbon' | 'star' | 'shield';

export type BorderStyle = 'classic-double' | 'ornate-corner' | 'modern-accent' | 'minimal' | 'gold-embossed' | 'geometric' | 'none';

export interface CertificateElement {
  id: string;
  type: ElementType;
  x: number; // in canvas px
  y: number; // in canvas px
  width: number;
  height: number;
  rotation?: number; // degrees 0-360
  opacity?: number; // 0-1
  zIndex?: number;
  locked?: boolean;
  hidden?: boolean;

  // Text specific
  content?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  letterSpacing?: number;
  lineHeight?: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  placeholderKey?: string; // e.g., 'RECIPIENT_NAME', 'COURSE_NAME', 'ISSUE_DATE'

  // Shape / Badge specific
  shapeKind?: ShapeKind;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  borderRadius?: number;
  badgeType?: 'gold-seal' | 'silver-seal' | 'ribbon-star' | 'laurel-wreath' | 'crest' | 'modern-shield';

  // Image specific
  src?: string;
  aspectRatioLock?: boolean;

  // QR specific
  qrValue?: string;
  qrColor?: string;
  qrBgColor?: string;
}

export interface BackgroundSettings {
  type: 'solid' | 'gradient' | 'pattern';
  color: string;
  secondaryColor?: string;
  gradientAngle?: number;
  patternType?: 'none' | 'guilloche' | 'dots' | 'diagonal-stripes' | 'parchment' | 'subtle-grid';
  patternOpacity?: number;
}

export interface BorderSettings {
  style: BorderStyle;
  color: string;
  secondaryColor?: string;
  width: number;
  inset: number;
}

export type TemplateCategory =
  | 'Academic & School'
  | 'University & Graduation'
  | 'Course Completion'
  | 'Professional Training'
  | 'Employee Recognition'
  | 'Achievement & Excellence'
  | 'Appreciation & Thank You'
  | 'Participation'
  | 'Sports & Athletics'
  | 'Internship & Fellowship'
  | 'Volunteer & Community Service'
  | 'Business & Corporate'
  | 'Technology & IT'
  | 'Healthcare & Medical'
  | 'Creative Arts & Design'
  | 'Leadership & Management'
  | 'Workshops & Seminars'
  | 'Competitions & Contests'
  | 'Safety & Compliance'
  | 'Special Occasions & Events'
  | 'Academic Certificates'
  | 'Achievement Awards'
  | 'Appreciation Certificates'
  | 'Participation Certificates'
  | 'Sports Certificates'
  | 'Training Certificates'
  | 'Internship Certificates'
  | 'Volunteer Certificates'
  | 'Excellence Awards'
  | 'Workshop Certificates'
  | 'Business Certificates'
  | 'Competition Certificates'
  | 'Custom Certificates'
  | string;

export type TemplateStyle =
  | 'modern'
  | 'classic'
  | 'minimal'
  | 'elegant'
  | 'corporate'
  | 'luxury'
  | 'vintage'
  | 'ornamental'
  | 'geometric'
  | 'creative'
  | string;

export interface CertificateTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  subcategory?: string;
  style: TemplateStyle;
  orientation: PageOrientation;
  format: PageFormat;
  width: number;
  height: number;
  description: string;
  background: BackgroundSettings;
  border: BorderSettings;
  elements: CertificateElement[];
  thumbnailUrl?: string;
  tags: string[];
  monthCollection?: number; // 1 to 12
  monthName?: string;
  popularity?: number;
  featured?: boolean;
}

export interface CertificateProject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  templateId?: string;
  width: number;
  height: number;
  orientation: PageOrientation;
  format: PageFormat;
  background: BackgroundSettings;
  border: BorderSettings;
  elements: CertificateElement[];
  thumbnail?: string;
}

export interface PlaceholderField {
  key: string;
  label: string;
  sampleValue: string;
  description: string;
}

export const STANDARD_PLACEHOLDERS: PlaceholderField[] = [
  { key: 'RECIPIENT_NAME', label: 'Recipient Name', sampleValue: 'Muhammad Ali', description: 'Name of the certificate recipient' },
  { key: 'COURSE_NAME', label: 'Course / Event Name', sampleValue: 'Full Stack Web Development & Modern Architecture', description: 'Subject or course completed' },
  { key: 'ORGANIZATION_NAME', label: 'Organization / Issuer', sampleValue: 'Metropolitan Academy of Digital Sciences', description: 'Awarding school, company or institution' },
  { key: 'ISSUE_DATE', label: 'Issue Date', sampleValue: 'November 7, 2026', description: 'Date of conferral' },
  { key: 'COMPLETION_DATE', label: 'Completion Date', sampleValue: 'October 30, 2026', description: 'End date of course or program' },
  { key: 'INSTRUCTOR_NAME', label: 'Instructor / Mentor', sampleValue: 'Dr. Elizabeth Warren, Ph.D.', description: 'Lead instructor or mentor' },
  { key: 'CERTIFICATE_ID', label: 'Certificate ID', sampleValue: 'CERT-2026-98421', description: 'Unique identification code' },
  { key: 'DESCRIPTION', label: 'Description', sampleValue: 'In recognition of outstanding dedication, rigorous mastery of curriculum, and exemplary achievement throughout the program.', description: 'Body commendation text' },
  { key: 'ISSUER_NAME', label: 'Authorized Signatory', sampleValue: 'Director of Academic Affairs', description: 'Signer title or official name' },
  { key: 'SIGNATURE', label: 'Signature', sampleValue: 'M. Ali', description: 'Handwritten signature representation' }
];

export interface BulkCsvRow {
  [columnName: string]: string;
}

export interface BulkMapping {
  [placeholderKey: string]: string; // placeholderKey -> csvColumnName
}

export interface BulkGenerationStatus {
  total: number;
  current: number;
  status: 'idle' | 'generating' | 'completed' | 'cancelled' | 'error';
  successCount: number;
  errorCount: number;
  errors: string[];
}
