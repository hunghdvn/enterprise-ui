import { useState } from 'react';
import { Button, Input } from '@enterprise-ui/components';

export function App() {
  const [name, setName] = useState('');
  const [savedName, setSavedName] = useState('');

  return (
    <main className="playground">
      <header className="playground__header">
        <p className="eyebrow">DESIGN SYSTEM FOUNDATION</p>
        <h1>Enterprise UI</h1>
        <p className="intro">
          Accessible, reusable React components for internal enterprise applications.
        </p>
      </header>

      <section className="demo-card" aria-labelledby="button-heading">
        <h2 id="button-heading">Button</h2>
        <p>Variants and sizes share the same interaction contract.</p>
        <div className="demo-row">
          <Button onClick={() => setSavedName(name || 'Enterprise UI')}>Primary action</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost" size="sm">
            Quiet action
          </Button>
          <Button variant="danger" size="sm">
            Destructive
          </Button>
        </div>
      </section>

      <section className="demo-card" aria-labelledby="input-heading">
        <h2 id="input-heading">Input</h2>
        <label className="field-label" htmlFor="project-name">
          Project name
        </label>
        <Input
          id="project-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter a project name"
        />
        <div className="demo-row">
          <Button onClick={() => setSavedName(name.trim())} disabled={!name.trim()}>
            Save value
          </Button>
          {savedName ? (
            <p className="saved-value" role="status">
              Saved: {savedName}
            </p>
          ) : null}
        </div>
      </section>

      <footer>Foundation preview · API subject to change before stable release</footer>
    </main>
  );
}
