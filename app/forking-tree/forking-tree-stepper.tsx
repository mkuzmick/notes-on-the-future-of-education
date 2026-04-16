"use client";

import { useCallback, useMemo, useState } from "react";
import { Rubric, Step, STEPS, TERMINALS, Terminal } from "./tree-data";

interface Crumb {
  stepId: string;
  choiceId: string;
  choiceLabel: string;
}

function isTerminal(id: string): boolean {
  return id.startsWith("t-");
}

export default function ForkingTreeStepper() {
  const [path, setPath] = useState<Crumb[]>([]);
  const [currentId, setCurrentId] = useState<string>("root");
  const [pendingChoice, setPendingChoice] = useState<string | null>(null);

  const goToChoice = useCallback((step: Step, choiceId: string) => {
    const choice = step.choices.find((c) => c.id === choiceId);
    if (!choice) return;
    setPendingChoice(choiceId);
    window.setTimeout(() => {
      setPath((prev) => [
        ...prev,
        { stepId: step.id, choiceId: choice.id, choiceLabel: choice.label },
      ]);
      setCurrentId(choice.next);
      setPendingChoice(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 220);
  }, []);

  const rewindTo = useCallback((targetIndex: number) => {
    setPath((prev) => {
      const newPath = prev.slice(0, targetIndex);
      const nextId =
        targetIndex === 0
          ? "root"
          : STEPS[newPath[newPath.length - 1].stepId]?.choices.find(
              (c) => c.id === newPath[newPath.length - 1].choiceId
            )?.next ?? "root";
      setCurrentId(nextId);
      return newPath;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const reset = useCallback(() => {
    setPath([]);
    setCurrentId("root");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const jumpToTerminal = useCallback((terminalId: string) => {
    setCurrentId(terminalId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const currentStep = STEPS[currentId];
  const currentTerminal = isTerminal(currentId) ? TERMINALS[currentId] : null;

  const breadcrumbs = useMemo(() => {
    const items: { label: string; onClick?: () => void; current?: boolean }[] = [
      { label: "Start", onClick: path.length > 0 || currentTerminal ? reset : undefined },
    ];
    path.forEach((crumb, i) => {
      items.push({
        label: crumb.choiceLabel,
        onClick: i < path.length - 1 || currentTerminal ? () => rewindTo(i + 1) : undefined,
      });
    });
    if (currentTerminal) {
      items.push({ label: currentTerminal.title, current: true });
    }
    return items;
  }, [path, currentTerminal, reset, rewindTo]);

  return (
    <div className="ft-stepper">
      <nav className="ft-breadcrumbs" aria-label="Path so far">
        {breadcrumbs.map((b, i) => (
          <span key={i} className="ft-crumb-wrap">
            {i > 0 && <span className="ft-crumb-sep" aria-hidden>›</span>}
            {b.onClick ? (
              <button className="ft-crumb ft-crumb-active" onClick={b.onClick}>
                {b.label}
              </button>
            ) : (
              <span className={`ft-crumb${b.current ? " ft-crumb-current" : ""}`}>
                {b.label}
              </span>
            )}
          </span>
        ))}
      </nav>

      {currentStep && (
        <QuestionScreen
          key={currentStep.id}
          step={currentStep}
          pendingChoice={pendingChoice}
          onChoose={(choiceId) => goToChoice(currentStep, choiceId)}
        />
      )}

      {currentTerminal && (
        <TerminalScreen
          key={currentTerminal.id}
          terminal={currentTerminal}
          onJump={jumpToTerminal}
          onReset={reset}
        />
      )}
    </div>
  );
}

function QuestionScreen({
  step,
  pendingChoice,
  onChoose,
}: {
  step: Step;
  pendingChoice: string | null;
  onChoose: (choiceId: string) => void;
}) {
  return (
    <div className="ft-step">
      <h1 className="ft-question">{step.question}</h1>
      {step.subquestion && (
        <p className="ft-subquestion">{step.subquestion}</p>
      )}
      <ul className="ft-choices">
        {step.choices.map((choice) => (
          <li key={choice.id}>
            <button
              className={`ft-choice${
                pendingChoice === choice.id ? " ft-choice-pending" : ""
              }`}
              onClick={() => onChoose(choice.id)}
              disabled={pendingChoice !== null}
            >
              <span className="ft-choice-label">{choice.label}</span>
              {choice.hint && (
                <span className="ft-choice-hint">{choice.hint}</span>
              )}
              <span className="ft-choice-arrow" aria-hidden>→</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TerminalScreen({
  terminal,
  onJump,
  onReset,
}: {
  terminal: Terminal;
  onJump: (id: string) => void;
  onReset: () => void;
}) {
  return (
    <article className="ft-terminal">
      <div className="ft-terminal-kind">
        {terminal.kind === "pathway" ? "Your pathway" : "A module you can layer in"}
      </div>
      <h1 className="ft-terminal-title">
        {terminal.title}
        <span className="ft-terminal-tagline"> — {terminal.tagline}</span>
      </h1>
      <p className="ft-terminal-summary">{terminal.summary}</p>

      <section className="ft-section">
        <h3 className="ft-section-h">Best for</h3>
        <p className="ft-section-p">{terminal.bestFor}</p>
      </section>

      <section className="ft-section">
        <h3 className="ft-section-h">What it looks like</h3>
        <p className="ft-section-p">{terminal.whatItLooksLike}</p>
      </section>

      {terminal.rubrics && terminal.rubrics.length > 0 && (
        <section className="ft-section">
          <h3 className="ft-section-h">
            Rubrics{" "}
            <span className="ft-section-h-count">
              {terminal.rubrics.length} — click to open
            </span>
          </h3>
          <div className="ft-rubric-stack">
            {terminal.rubrics.map((rubric, i) => (
              <RubricAccordion
                key={rubric.name}
                rubric={rubric}
                defaultOpen={i === 0}
              />
            ))}
          </div>
        </section>
      )}

      {terminal.testimonials && terminal.testimonials.length > 0 && (
        <section className="ft-section">
          <h3 className="ft-section-h">From faculty who've run it</h3>
          <div className="ft-quote-stack">
            {terminal.testimonials.map((t, i) => (
              <blockquote key={i} className="ft-quote">
                <p>{t.quote}</p>
                <footer>— {t.attribution}</footer>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {terminal.examples && terminal.examples.length > 0 && (
        <section className="ft-section">
          <h3 className="ft-section-h">
            Where it's been run
            <span className="ft-section-h-count">
              {terminal.examples.length} programs
            </span>
          </h3>
          <div className="ft-example-stack">
            {terminal.examples.map((ex, i) => (
              <div key={i} className="ft-example">
                <div className="ft-example-place">{ex.place}</div>
                <div className="ft-example-story">{ex.story}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="ft-section">
        <h3 className="ft-section-h">What to watch for</h3>
        <ul className="ft-bullets">
          {terminal.concerns.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>

      <section className="ft-section">
        <h3 className="ft-section-h">Getting started</h3>
        <p className="ft-section-p">{terminal.gettingStarted}</p>
      </section>

      {terminal.alsoTry && terminal.alsoTry.length > 0 && (
        <section className="ft-section ft-alsotry-section">
          <h3 className="ft-section-h">Also reachable from here</h3>
          <div className="ft-alsotry-list">
            {terminal.alsoTry.map((link) => {
              const target = TERMINALS[link.targetId];
              if (!target) return null;
              return (
                <button
                  key={link.targetId}
                  className="ft-alsotry-item"
                  onClick={() => onJump(link.targetId)}
                >
                  <span className="ft-alsotry-title">
                    {target.title}
                    <span className="ft-alsotry-tagline"> — {target.tagline}</span>
                  </span>
                  <span className="ft-alsotry-reason">{link.reason}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <div className="ft-terminal-actions">
        <button className="ft-action-primary" onClick={onReset}>
          Ask a different question
        </button>
      </div>
    </article>
  );
}

function RubricAccordion({
  rubric,
  defaultOpen,
}: {
  rubric: Rubric;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`ft-rubric${open ? " ft-rubric-open" : ""}`}>
      <button
        className="ft-rubric-head"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="ft-rubric-chevron" aria-hidden>
          {open ? "▾" : "▸"}
        </span>
        <span className="ft-rubric-name">{rubric.name}</span>
      </button>
      {open && (
        <div className="ft-rubric-body">
          <p className="ft-rubric-attribution">{rubric.attribution}</p>
          <div className="ft-rubric-table-wrap">
            <table className="ft-rubric-table">
              <tbody>
                {rubric.rows.map((row) => (
                  <tr key={row.criterion}>
                    <th scope="row">{row.criterion}</th>
                    <td>
                      {row.top}
                      {row.bottom && (
                        <>
                          <span className="ft-rubric-divider"> ⟷ </span>
                          <span className="ft-rubric-bottom">{row.bottom}</span>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rubric.note && <p className="ft-rubric-note">{rubric.note}</p>}
        </div>
      )}
    </div>
  );
}
