import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const FEATURES = [
  {
    tag: 'Memory',
    title: 'Semantic mistake memory',
    body: 'Stores causal chains — action → feedback → outcome — as a semantic graph. Similar mistakes merge automatically so agents don\'t re-learn the same lesson twice.',
    icon: '◈',
  },
  {
    tag: 'Guard',
    title: 'Pre-step guardrails',
    body: 'Every proposed action is reviewed against memory before execution. Warn, block, or require acknowledgement — configurable per policy without touching your planner.',
    icon: '⬡',
  },
  {
    tag: 'Graph',
    title: 'Living memory graph',
    body: 'Merges paraphrased variants, reinforces repeated signals, prunes stale weak memories on schedule. The graph stays healthy without manual curation.',
    icon: '⬢',
  },
  {
    tag: 'MCP',
    title: 'MCP server + adapters',
    body: 'Run as a standalone MCP server or drop the LangGraph review node directly into your planner graph. Works with any tool-calling agent pipeline.',
    icon: '◎',
  },
];

const FLOW = [
  { step: '01', label: 'Plan step' },
  { step: '02', label: 'DriftGuard review' },
  { step: '03', label: 'Warning surfaced' },
  { step: '04', label: 'Agent revises' },
  { step: '05', label: 'Execute' },
  { step: '06', label: 'Record feedback' },
];

function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroNoise} />
      <div className={styles.heroGrid} />
      <div className="container">
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              semantic mistake memory for autonomous agents
            </div>

            <Heading as="h1" className={styles.heroTitle}>
              Drift<span className={styles.heroAccent}>Guard</span>
            </Heading>

            <p className={styles.heroTagline}>
              Agents act. Most can't remember mistakes meaningfully.
            </p>

            <p className={styles.heroBody}>
              DriftGuard sits between <code>intent</code> and <code>execution</code> —
              reviewing each proposed action against a semantic graph of past failures,
              surfacing warnings before damage is done, and recording outcomes so the
              graph grows smarter with every run.
            </p>

            <div className={styles.heroActions}>
              <Link className="button button--primary button--lg" to="/docs/intro">
                Read the docs
              </Link>
              <Link className="button button--secondary button--lg" to="/docs/quickstart">
                Quickstart →
              </Link>
            </div>

            <div className={styles.heroPip}>
              <code className={styles.pipInstall}>pip install driftguard-ai</code>
            </div>
          </div>

          <div className={styles.heroPanel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelDot} style={{background:'#ef4444'}} />
              <span className={styles.panelDot} style={{background:'#f59e0b'}} />
              <span className={styles.panelDot} style={{background:'#10b981'}} />
              <span className={styles.panelFile}>agent_loop.py</span>
            </div>
            <pre className={styles.panelCode}>{`from driftguard import DriftGuard

guard = DriftGuard()

# Review before acting
review = guard.before_step(
    "increase salt"
)

if review.warnings:
    risk = review.warnings[0].risk
    print(f"⚠ {risk}")
    # → "too salty"

# Record what happened
guard.record(
    action="increase salt",
    feedback="too salty",
    outcome="dish ruined",
)`}</pre>
          </div>
        </div>
      </div>
    </section>
  );
}

function FlowSection() {
  return (
    <section className={styles.flowSection}>
      <div className="container">
        <p className={styles.sectionEyebrow}>How it works</p>
        <Heading as="h2" className={styles.sectionTitle}>
          One loop. Remembered forever.
        </Heading>
        <div className={styles.flowTrack}>
          {FLOW.map((item, i) => (
            <div key={i} className={styles.flowItem}>
              <div className={styles.flowStep}>{item.step}</div>
              <div className={styles.flowConnector} />
              <div className={styles.flowLabel}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className={styles.features}>
      <div className="container">
        <p className={styles.sectionEyebrow}>Capabilities</p>
        <Heading as="h2" className={styles.sectionTitle}>
          Built for agents that need to learn.
        </Heading>
        <div className={styles.featureGrid}>
          {FEATURES.map((f, i) => (
            <div key={i} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <p className={styles.featureTag}>{f.tag}</p>
              <Heading as="h3" className={styles.featureTitle}>{f.title}</Heading>
              <p className={styles.featureBody}>{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PolicySection() {
  const policies = [
    { name: 'warn', desc: 'Surface warning only — agent decides', color: '#f59e0b' },
    { name: 'block', desc: 'Raise exception — hard stop', color: '#ef4444' },
    { name: 'acknowledge', desc: 'Require explicit confirmation', color: '#3b82f6' },
    { name: 'record_only', desc: 'Store memory, skip review', color: '#10b981' },
  ];

  return (
    <section className={styles.policySection}>
      <div className="container">
        <div className={styles.policyInner}>
          <div className={styles.policyCopy}>
            <p className={styles.sectionEyebrow}>Guard Policies</p>
            <Heading as="h2" className={styles.sectionTitle}>
              You control how the agent reacts.
            </Heading>
            <p className={styles.policyBody}>
              DriftGuard doesn't force a single response model. Pick the policy that
              matches your agent's risk tolerance — and change it per-step if needed.
            </p>
            <Link className="button button--primary" to="/docs/guard-policies">
              See all policies
            </Link>
          </div>
          <div className={styles.policyCards}>
            {policies.map((p, i) => (
              <div key={i} className={styles.policyCard}>
                <span className={styles.policyDot} style={{background: p.color}} />
                <code className={styles.policyName}>{p.name}</code>
                <span className={styles.policyDesc}>{p.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className={styles.cta}>
      <div className="container">
        <div className={styles.ctaInner}>
          <Heading as="h2" className={styles.ctaTitle}>
            Stop letting agents repeat themselves.
          </Heading>
          <p className={styles.ctaBody}>
            DriftGuard is open source, MIT licensed, and ready for early production experimentation.
          </p>
          <div className={styles.ctaActions}>
            <Link className="button button--primary button--lg" to="/docs/intro">
              Get started
            </Link>
            <a
              className="button button--secondary button--lg"
              href="https://github.com/sujal-maheshwari2004/DriftGuard"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="DriftGuard — Semantic mistake memory for agents"
      description="DriftGuard is a semantic mistake-memory and guardrail layer for autonomous agents. Sits between intent and execution.">
      <HeroSection />
      <FlowSection />
      <FeaturesSection />
      <PolicySection />
      <CtaSection />
    </Layout>
  );
}