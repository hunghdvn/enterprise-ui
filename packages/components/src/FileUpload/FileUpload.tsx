import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from '../Icon';
import type { FileUploadProps } from './types';
import styles from './FileUpload.module.css';

const DEFAULT_LABEL = 'Kéo thả file vào đây hoặc bấm để chọn';

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUpload({
  files,
  onSelect,
  onRemove,
  accept,
  multiple = false,
  disabled = false,
  dragLabel = DEFAULT_LABEL,
  className,
  'aria-label': ariaLabel,
}: FileUploadProps) {
  const uid = useId();
  const inputId = `file-upload-${uid.replace(/:/g, '')}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  // Dev-only diagnostic for duplicate display names (review Combobox #14
  // precedent) — never shipped to production.
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const seen = new Set<string>();
    for (const f of files) {
      if (seen.has(f.name)) {
        console.warn(`[FileUpload] duplicate file name "${f.name}" — identity is ambiguous.`);
      }
      seen.add(f.name);
    }
  }, [files]);

  const openPicker = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    if (picked.length > 0) onSelect(picked);
    // Reset so selecting the SAME file twice still fires onChange.
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (disabled) return;
    const dropped = Array.from(e.dataTransfer.files ?? []);
    if (dropped.length > 0) onSelect(dropped);
  };

  return (
    <div
      className={className ? `${styles.wrap} ${className}` : styles.wrap}
      data-disabled={disabled || undefined}
    >
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={ariaLabel ?? dragLabel}
        aria-disabled={disabled || undefined}
        className={dragOver ? `${styles.zone} ${styles['zone-active']}` : styles.zone}
        onClick={openPicker}
        onKeyDown={(e) => {
          // IME guard for completeness; no text input here, but keep the
          // convention (Combobox review #10).
          if (e.nativeEvent.isComposing || e.keyCode === 229) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openPicker();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <span className={styles.zoneIcon} aria-hidden="true">
          <Icon name="upload" size={20} />
        </span>
        <span className={styles.zoneLabel}>{dragLabel}</span>
        {accept && <span className={styles.zoneHint}>Định dạng: {accept}</span>}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          id={inputId}
          className={styles.input}
          onChange={handleChange}
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>

      {files.length > 0 && (
        <ul className={styles.list} aria-label="Danh sách file đã chọn">
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`} className={styles.item}>
              <span className={styles.itemName}>{file.name}</span>
              <span className={styles.itemMeta}>
                {formatSize(file.size)}
                {file.type ? ` · ${file.type}` : ''}
              </span>
              <button
                type="button"
                className={styles['item-remove']}
                aria-label={`Xóa ${file.name}`}
                disabled={disabled}
                onClick={() => onRemove(index)}
              >
                <Icon name="x" size={12} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
