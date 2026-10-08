/** The three steps from download to the eye icon in the menu bar. */
export function InstallSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="mt-3 grid gap-2.5">
      {steps.map((s, i) => (
        <li key={s} className="flex gap-3 text-body-sm text-fg">
          <span
            className="grid size-6 flex-none place-items-center rounded-full border border-border-strong font-mono text-caption text-fg-muted tabular-nums"
            aria-hidden="true"
          >
            {i + 1}
          </span>
          <span className="pt-0.5 text-pretty">{s}</span>
        </li>
      ))}
    </ol>
  );
}
