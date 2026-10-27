import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Icon } from '../Icon';
import type { FileUploadProps, UploadedFile } from './types';
import styles from './FileUpload.module.css';

const DEFAULT_LABEL = 'Kéo thả file vào đây hoặc bấm để chọn';

function formatSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUpload({
  files: filesProp,
  onSelect,
  onRemove,
  accept,
  multiple = false,
  disabled = false,
  dragLabel = DEFAULT_LABEL,
  className,
  'aria-label': ariaLabel,
}: FileUploadProps) {
  const files: UploadedFile[] = useMemo(() => filesProp ?? [], [filesProp]);
  const label = dragLabel || DEFAULT_LABEL;
  const uid = useId();
  const inputId = `file-upload-${uid.replace(/:/g, '')}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const dragCounter = useRef(0);
  const lastWarnSig = useRef<string | null>(null);

  // Dev-only diagnostic for duplicate display names — never shipped to
  // production. Re-scan only when the file signature changes.
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const sig = files.map((f) => f.name).join('\u0001');
    if (sig === lastWarnSig.current) return;
    lastWarnSig.current = sig;
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
    try {
      if (picked.length > 0) onSelect(picked);
    } finally {
      // Reset so selecting the SAME file twice still fires onChange, even if
      // onSelect throws.
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setDragOver(false);
    if (disabled) return;
    const dropped = Array.from(e.dataTransfer?.files ?? []);
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
        aria-label={ariaLabel ?? label}
        aria-disabled={disabled || undefined}
        className={dragOver ? `${styles.zone} ${styles['zone-active']}` : styles.zone}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.nativeEvent.isComposing || e.keyCode === 229) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openPicker();
          }
        }}
        onDragEnter={(e) => {
          if (disabled) return;
          // Only react to file drags. When dataTransfer is missing (e.g. some
          // synthetic events) we cannot tell, so default to accepting.
          if (e.dataTransfer && !e.dataTransfer.types?.includes('Files')) return;
          dragCounter.current += 1;
          setDragOver(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (disabled) return;
          if (e.dataTransfer && !e.dataTransfer.types?.includes('Files')) return;
          if (!dragOver) setDragOver(true);
        }}
        onDragLeave={(e) => {
          if (disabled) return;
          dragCounter.current = Math.max(0, dragCounter.current - 1);
          // Only clear when leaving the zone entirely (counter 0). Child
          // transitions keep the highlight.
          if (dragCounter.current === 0) {
            const related = e.relatedTarget as Node | null;
            const zone = e.currentTarget as Node;
            if (!related || !zone.contains(related)) setDragOver(false);
          }
        }}
        onDrop={handleDrop}
      >
        <span className={styles.zoneIcon} aria-hidden="true">
          <Icon name="upload" size={20} />
        </span>
        <span className={styles.zoneLabel}>{label}</span>
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
          onClick={(e) => e.stopPropagation()}
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
