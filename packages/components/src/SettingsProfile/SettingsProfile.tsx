import { useId, useState } from 'react';
import { cx } from '../internal/cx';
import { isPresent } from '../internal/isPresent';
import styles from './SettingsProfile.module.css';
import type { SettingsProfileProps } from './types';

export function SettingsProfile({
  title = 'Cài đặt',
  subtitle,
  actions,
  sections,
  activeKey,
  defaultActiveKey,
  onSectionChange,
  navLabel = 'Mục cài đặt',
  level = 1,
  className = '',
}: SettingsProfileProps) {
  const [uncontrolled, setUncontrolled] = useState<string | undefined>(
    () => defaultActiveKey ?? sections[0]?.key,
  );
  const baseId = useId();
  const Title: 'h1' | 'h2' = level === 1 ? 'h1' : 'h2';
  const PaneTitle: 'h2' | 'h3' = level === 1 ? 'h2' : 'h3';

  const candidate = activeKey !== undefined ? activeKey : uncontrolled;
  // A stale key (its section was removed) or an empty list must not blank the page:
  // fall back to the first section, and to nothing at all when there is none.
  const current = sections.some((section) => section.key === candidate)
    ? candidate
    : sections[0]?.key;

  const select = (key: string) => {
    if (activeKey === undefined) setUncontrolled(key);
    onSectionChange?.(key);
  };

  return (
    <div className={cx(styles.root, className)}>
      <header className={styles.header}>
        <Title className={styles.title}>{title}</Title>
        {isPresent(subtitle) && <p className={styles.subtitle}>{subtitle}</p>}
        {isPresent(actions) && <div className={styles.actions}>{actions}</div>}
      </header>
      {sections.length > 0 && (
        <div className={styles.layout}>
          <nav className={styles.nav} aria-label={navLabel}>
            {sections.map((section) => {
              const isActive = section.key === current;
              return (
                <button
                  key={section.key}
                  type="button"
                  className={styles.navItem}
                  data-active={isActive ? 'true' : 'false'}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => select(section.key)}
                >
                  {section.label}
                </button>
              );
            })}
          </nav>
          <div className={styles.panes}>
            {sections.map((section) => {
              const isActive = section.key === current;
              // Keys are unique by contract, so one base id plus the key stays stable
              // across renders and lets each pane be labelled by its own heading.
              const paneId = `${baseId}-${section.key}`;
              return (
                <section
                  key={section.key}
                  className={styles.pane}
                  aria-labelledby={paneId}
                  // Stays mounted so a half-typed value in another pane survives the
                  // switch; `hidden` takes it out of the a11y tree and the tab order.
                  hidden={!isActive}
                >
                  <PaneTitle className={styles.paneTitle} id={paneId}>
                    {section.label}
                  </PaneTitle>
                  {isPresent(section.description) && (
                    <p className={styles.paneDescription}>{section.description}</p>
                  )}
                  <div className={styles.paneBody}>{section.content}</div>
                </section>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
