export interface UploadedFile {
  name: string;
  size: number; // bytes
  type: string; // mime type (empty string allowed)
}

/**
 * Presentational-only file picker (P2). The parent owns the real `File[]`,
 * validation (accept/maxSize), upload progress and error state — the component
 * only renders the drop zone + selected-file list and reports `onSelect` /
 * `onRemove`.
 */
export interface FileUploadProps {
  files: UploadedFile[];
  onSelect: (files: File[]) => void;
  onRemove: (index: number) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  dragLabel?: string;
  className?: string;
  'aria-label'?: string;
}
