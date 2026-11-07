import { useEffect, useId, useRef, useState } from 'react';
import { cx } from '../internal/cx';
import { isPresent } from '../internal/isPresent';
import styles from './SettingsProfile.module.css';
import type { SettingsProfileProps } from './types';

export function SettingsProfile({
  as = 'main',
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
  // `main` by default: AppShell's content area is a <div>, so a template rendered
  // there would otherwise leave the page without a main landmark. Only `div` when the
  // page already renders one.
  const Root = as;
  const [uncontrolled, setUncontrolled] = useState<string | undefined>(
    () => defaultActiveKey ?? sections[0]?.key,
  );
  const baseId = useId();
  const navRef = useRef<HTMLElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);
  const Title: 'h1' | 'h2' = level === 1 ? 'h1' : 'h2';
  const PaneTitle: 'h2' | 'h3' = level === 1 ? 'h2' : 'h3';
  const titleId = `${baseId}-title`;

  const candidate = activeKey !== undefined ? activeKey : uncontrolled;
  // A stale key (its section was removed) or an empty list must not blank the page:
  // fall back to the first section, and to nothing at all when there is none.
  const current = sections.some((section) => section.key === candidate)
    ? candidate
    : sections[0]?.key;

  // The fallback above only decides what to paint. Without reconciling, the internal state
  // (or the caller's `activeKey`) still holds the stale key, so a section that comes back
  // silently takes the view over, and anything keyed on the caller's value acts on a
  // section that is not on screen.
  //
  // Uncontrolled: adjust state during render — React's own pattern for derived state, and
  // it repaints before commit, so the state and the visible pane can never disagree. An
  // effect here would cascade a second render and lint forbids it.
  if (activeKey === undefined && current !== undefined && uncontrolled !== current) {
    setUncontrolled(current);
  }

  // Controlled: the caller owns the state, so the only way to tell them is the callback.
  // A ref keeps it to one report per stale key — an inline `onSectionChange` is a new
  // function on every render, and re-firing it would loop.
  const reportedStale = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (activeKey === undefined) return;
    if (current === undefined || current === candidate) {
      reportedStale.current = undefined;
      return;
    }
    if (reportedStale.current === candidate) return;
    reportedStale.current = candidate;
    onSectionChange?.(current);
  }, [current, candidate, activeKey, onSectionChange]);

  // A long list in a narrow container scrolls horizontally, and the active section can
  // start off-screen. Move only the nav's own scroll offset, never the page's.
  //
  // Rects, not `offsetLeft`: that value is relative to the offsetParent, which is <body>
  // unless an ancestor is positioned, so inside a padded frame (AppShell, the docs page)
  // it includes the nav's own distance from the page edge and overshoots. Subtracting the
  // two rects cancels that out, and `scrollLeft +=` composes with the current offset.
  useEffect(() => {
    const nav = navRef.current;
    const active = activeRef.current;
    if (!nav || !active || nav.scrollWidth <= nav.clientWidth) return;
    const navRect = nav.getBoundingClientRect();
    const itemRect = active.getBoundingClientRect();
    nav.scrollLeft += itemRect.left - navRect.left - (nav.clientWidth - itemRect.width) / 2;
  }, [current]);

  const select = (key: string) => {
    if (activeKey === undefined) setUncontrolled(key);
    onSectionChange?.(key);
  };

  return (
    <Root
      className={cx(styles.root, className)}
      // A named `main`/`section` is a landmark; a `div` is generic and ARIA 1.2
      // prohibits aria-labelledby on role=generic.
      aria-labelledby={as === 'div' ? undefined : titleId}
    >
      {/* Not a <header> landmark concern: inside `main` a header is not a banner, so
          this never becomes a second site banner alongside AppShell's. */}
      <header className={styles.header}>
        <Title className={styles.title} id={titleId}>
          {title}
        </Title>
        {isPresent(subtitle) && <p className={styles.subtitle}>{subtitle}</p>}
        {isPresent(actions) && <div className={styles.actions}>{actions}</div>}
      </header>
      {sections.length > 0 && (
        <div className={styles.layout}>
          <nav className={styles.nav} aria-label={navLabel} ref={navRef}>
            {sections.map((section) => {
              const isActive = section.key === current;
              return (
                <button
                  key={section.key}
                  type="button"
                  ref={isActive ? activeRef : undefined}
                  className={styles.navItem}
                  data-active={isActive ? 'true' : 'false'}
                  // "true", not "page": the page is the route, which AppShell's sidebar
                  // already marks. This names the current item within the section set.
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => select(section.key)}
                >
                  {section.label}
                </button>
              );
            })}
          </nav>
          <div className={styles.panes}>
            {sections.map((section, index) => {
              const isActive = section.key === current;
              // Index-based, not key-based: `aria-labelledby` is a space-separated id
              // list, so a key like "account settings" would split into two ids and the
              // section would lose its name. An index also cannot collide with a
              // sibling key such as "privacy-description".
              const paneId = `${baseId}-pane-${index}`;
              const descriptionId = `${baseId}-desc-${index}`;
              return (
                <section
                  key={section.key}
                  className={styles.pane}
                  aria-labelledby={paneId}
                  // The heading names the region; the description is extra context, so it
                  // goes through aria-describedby instead of only being read inline.
                  aria-describedby={isPresent(section.description) ? descriptionId : undefined}
                  // Stays mounted so a half-typed value in another pane survives the
                  // switch; `hidden` takes it out of the a11y tree and the tab order.
                  hidden={!isActive}
                >
                  <PaneTitle className={styles.paneTitle} id={paneId}>
                    {section.label}
                  </PaneTitle>
                  {isPresent(section.description) && (
                    <p className={styles.paneDescription} id={descriptionId}>
                      {section.description}
                    </p>
                  )}
                  <div className={styles.paneBody}>{section.content}</div>
                </section>
              );
            })}
          </div>
        </div>
      )}
    </Root>
  );
}
