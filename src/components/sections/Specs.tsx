const specs = [
  { term: "Requires", value: "macOS 14 Sonoma+" },
  { term: "Architecture", value: "Universal (Apple silicon, Intel)" },
  { term: "Permissions", value: "None required" },
  { term: "Network", value: "Never. 100% local" },
];

export function Specs() {
  return (
    <dl className="grid grid-cols-2 gap-6 border-t border-border pt-7 pb-14 lg:grid-cols-4">
      {specs.map((s) => (
        <div key={s.term}>
          <dt className="font-mono text-2xs leading-none font-medium tracking-[0.08em] text-fg-subtle uppercase">
            {s.term}
          </dt>
          <dd className="mt-2 text-sm">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}
