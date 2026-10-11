import { useState } from 'react';
import { Button, Input } from '@enterprise-ui/components';

const skyScale = [
  ['50', '#f0f9ff'],
  ['100', '#e0f2fe'],
  ['200', '#bae6fd'],
  ['300', '#7dd3fc'],
  ['400', '#38bdf8'],
  ['500', '#0ea5e9'],
  ['600', '#0284c7'],
  ['700', '#0369a1'],
  ['800', '#075985'],
  ['900', '#0c4a6e'],
] as const;

const neutralScale = [
  ['50', '#f8fafc'],
  ['100', '#f1f5f9'],
  ['200', '#e2e8f0'],
  ['300', '#cbd5e1'],
  ['400', '#94a3b8'],
  ['500', '#64748b'],
  ['600', '#475569'],
  ['700', '#334155'],
  ['800', '#1e293b'],
  ['900', '#172b3a'],
] as const;

export function App() {
  const [projectName, setProjectName] = useState('Northstar Operations');
  const [savedName, setSavedName] = useState('');
  const [dark, setDark] = useState(false);

  return (
    <main className="playground" data-eui-theme={dark ? 'dark' : undefined}>
      <header className="hero">
        <div className="hero__topline">
          <a className="wordmark" href="#top" aria-label="Enterprise UI home">
            <span className="wordmark__mark" aria-hidden="true">
              E
            </span>
            <span>
              enterprise<span className="wordmark__light">/ui</span>
            </span>
          </a>
          <div className="hero__actions">
            <span className="version-pill">FOUNDATION · 0.1</span>
            <Button variant="secondary" size="sm" onClick={() => setDark((value) => !value)}>
              {dark ? 'Light preview' : 'Dark preview'}
            </Button>
          </div>
        </div>

        <div className="hero__content" id="top">
          <p className="eyebrow">
            <span className="eyebrow__dot" /> DESIGN SYSTEM / BALANCED SKY
          </p>
          <h1>Clarity for complex work.</h1>
          <p className="hero__intro">
            A deliberate foundation for enterprise software: precise typography, calm surfaces,
            accessible contrast and a sky-blue interaction language.
          </p>
          <div className="hero__meta">
            <span>
              <span className="meta-dot meta-dot--sky" /> Sky-led palette
            </span>
            <span>
              <span className="meta-dot meta-dot--slate" /> Structured neutrals
            </span>
            <span>
              <span className="meta-dot meta-dot--green" /> Accessible by default
            </span>
          </div>
        </div>
        <div className="hero__orb hero__orb--one" aria-hidden="true" />
        <div className="hero__orb hero__orb--two" aria-hidden="true" />
      </header>

      <div className="content">
        <section className="section" aria-labelledby="palette-heading">
          <div className="section__heading">
            <div>
              <p className="section-kicker">01 / COLOR SYSTEM</p>
              <h2 id="palette-heading">Balanced Sky</h2>
              <p className="section-description">
                A confident blue for actions, supported by cool slate neutrals. Color is purposeful,
                not decorative.
              </p>
            </div>
            <span className="section-index">COLOR / 20 TOKENS</span>
          </div>

          <div className="palette-card">
            <div className="palette-card__head">
              <div>
                <h3>Sky</h3>
                <p>Brand, focus and selection</p>
              </div>
              <span className="token-name">palette.sky</span>
            </div>
            <div className="swatches">
              {skyScale.map(([step, color]) => (
                <div className="swatch" key={step}>
                  <div className="swatch__color" style={{ backgroundColor: color }} />
                  <span className="swatch__step">{step}</span>
                  <span className="swatch__hex">{color}</span>
                </div>
              ))}
            </div>
            <div className="palette-card__head palette-card__head--second">
              <div>
                <h3>Slate</h3>
                <p>Text, borders and surfaces</p>
              </div>
              <span className="token-name">palette.slate</span>
            </div>
            <div className="swatches">
              {neutralScale.map(([step, color]) => (
                <div className="swatch" key={step}>
                  <div className="swatch__color" style={{ backgroundColor: color }} />
                  <span className="swatch__step">{step}</span>
                  <span className="swatch__hex">{color}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="semantic-grid">
            <div className="semantic-item">
              <span className="semantic-item__bar semantic-item__bar--primary" />
              <div>
                <strong>Primary</strong>
                <span>Action and focus</span>
              </div>
              <code>#0369A1</code>
            </div>
            <div className="semantic-item">
              <span className="semantic-item__bar semantic-item__bar--success" />
              <div>
                <strong>Success</strong>
                <span>Completed states</span>
              </div>
              <code>#15803D</code>
            </div>
            <div className="semantic-item">
              <span className="semantic-item__bar semantic-item__bar--warning" />
              <div>
                <strong>Warning</strong>
                <span>Needs attention</span>
              </div>
              <code>#B45309</code>
            </div>
            <div className="semantic-item">
              <span className="semantic-item__bar semantic-item__bar--danger" />
              <div>
                <strong>Danger</strong>
                <span>Destructive states</span>
              </div>
              <code>#B42318</code>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="type-heading">
          <div className="section__heading">
            <div>
              <p className="section-kicker">02 / TYPOGRAPHY</p>
              <h2 id="type-heading">Hierarchy over decoration.</h2>
              <p className="section-description">
                Compact labels, readable body text and strong page titles help users scan dense
                operational screens.
              </p>
            </div>
            <span className="section-index">TYPE / INTER SYSTEM</span>
          </div>
          <div className="type-specimen">
            <div className="type-specimen__row type-specimen__row--display">
              <span className="type-label">Display / 32</span>
              <span className="type-display">Clarity for complex work.</span>
            </div>
            <div className="type-specimen__row">
              <span className="type-label">Heading / 24</span>
              <span className="type-heading">Operations overview</span>
            </div>
            <div className="type-specimen__row">
              <span className="type-label">Body / 14</span>
              <span className="type-body">
                Review activity, track changes and keep teams aligned.
              </span>
            </div>
            <div className="type-specimen__row">
              <span className="type-label">Label / 12</span>
              <span className="type-caption">LAST UPDATED · 2 MIN AGO</span>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="components-heading">
          <div className="section__heading">
            <div>
              <p className="section-kicker">03 / COMPONENTS</p>
              <h2 id="components-heading">Quietly confident controls.</h2>
              <p className="section-description">
                Consistent sizing and restrained surfaces keep the interface focused on the task.
              </p>
            </div>
            <span className="section-index">REACT / LIVE PREVIEW</span>
          </div>

          <div className="component-grid">
            <article className="specimen-card">
              <div className="specimen-card__heading">
                <div>
                  <h3>Buttons</h3>
                  <p>Actions have a clear hierarchy.</p>
                </div>
                <span className="component-tag">Button</span>
              </div>
              <div className="control-stack">
                <div className="control-row">
                  <Button>Save changes</Button>
                  <Button variant="secondary">Cancel</Button>
                </div>
                <div className="control-row">
                  <Button variant="ghost" size="sm">
                    View details
                  </Button>
                  <Button variant="danger" size="sm">
                    Delete record
                  </Button>
                </div>
                <div className="control-row">
                  <Button size="sm">Compact</Button>
                  <Button size="md">Default</Button>
                  <Button size="lg">Comfortable</Button>
                </div>
              </div>
              <p className="specimen-note">
                Primary uses Sky 700 for readable white-on-blue contrast.
              </p>
            </article>

            <article className="specimen-card">
              <div className="specimen-card__heading">
                <div>
                  <h3>Form field</h3>
                  <p>Labels stay explicit and close to inputs.</p>
                </div>
                <span className="component-tag">Input</span>
              </div>
              <form
                className="demo-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  setSavedName(projectName.trim());
                }}
              >
                <label htmlFor="project-name">Workspace name</label>
                <Input
                  id="project-name"
                  value={projectName}
                  onChange={(event) => setProjectName(event.target.value)}
                  placeholder="Enter a workspace name"
                  required
                />
                <span className="field-hint">Use a name your team will recognize.</span>
                <div className="control-row control-row--form">
                  <Button type="submit" disabled={!projectName.trim()}>
                    Save workspace
                  </Button>
                  {savedName ? (
                    <span className="saved-state" role="status">
                      Saved: {savedName}
                    </span>
                  ) : null}
                </div>
              </form>
            </article>
          </div>

          <div className="status-panel">
            <div className="status-panel__heading">
              <div>
                <h3>Semantic states</h3>
                <p>Status colors carry meaning, not brand decoration.</p>
              </div>
            </div>
            <div className="status-list">
              <span className="status-chip status-chip--success">
                <span />
                All systems operational
              </span>
              <span className="status-chip status-chip--warning">
                <span />
                Review required
              </span>
              <span className="status-chip status-chip--danger">
                <span />
                Action failed
              </span>
              <span className="status-chip status-chip--info">
                <span />
                New activity
              </span>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="principles-heading">
          <div className="section__heading">
            <div>
              <p className="section-kicker">04 / PRINCIPLES</p>
              <h2 id="principles-heading">Designed for real work.</h2>
            </div>
            <span className="section-index">FOUNDATION / V1</span>
          </div>
          <div className="principles-grid">
            <article className="principle">
              <span className="principle__number">01</span>
              <h3>Purposeful color</h3>
              <p>Sky marks actions and focus. Semantic colors remain reserved for their meaning.</p>
            </article>
            <article className="principle">
              <span className="principle__number">02</span>
              <h3>Structured density</h3>
              <p>
                Spacing and control sizes support both compact data views and comfortable forms.
              </p>
            </article>
            <article className="principle">
              <span className="principle__number">03</span>
              <h3>Accessible contrast</h3>
              <p>
                Visible focus, native semantics and readable contrast are part of the foundation.
              </p>
            </article>
          </div>
        </section>

        <footer className="footer">
          <a className="wordmark wordmark--footer" href="#top">
            <span className="wordmark__mark" aria-hidden="true">
              E
            </span>
            <span>
              enterprise<span className="wordmark__light">/ui</span>
            </span>
          </a>
          <span>Balanced Sky · Design foundation preview</span>
          <a href="#top">Back to top ↑</a>
        </footer>
      </div>
    </main>
  );
}
