
export interface ContentBlock {
  type: 'paragraph' | 'list' | 'table' | 'subheading' | 'callout';
  content: string; 
  label?: string; // e.g., "Exam Tip", "Definition", "Summary"
}

export interface DocumentSection {
  title: string;
  blocks: ContentBlock[];
}

export interface RedesignData {
  documentTitle: string;
  subjectCode?: string;
  themeColors: {
    primary: string;
    secondary: string;
  };
  sections: DocumentSection[];
}

export interface FileData {
  base64: string;
  mimeType: string;
  name: string;
}

// Added DesignReport interface to support ReportView.tsx
export interface DesignReport {
  visualTone: string;
  colorUsage: string;
  typography: string;
  layoutStructure: string;
  iconsAndEmojis: string;
  memoryTricks: string;
  spacingAndMargins: string;
  finalSummary: string;
}
