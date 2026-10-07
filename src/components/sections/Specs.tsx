import styles from "./sections.module.css";

const specs = [
  { term: "Requires", value: "macOS 14 Sonoma+" },
  { term: "Architecture", value: "Universal (Apple silicon, Intel)" },
  { term: "Permissions", value: "None required" },
  { term: "Network", value: "Never. 100% local" },
];

export function Specs() {
  return (
    <dl className={styles.specs}>
      {specs.map((s) => (
        <div key={s.term}>
          <dt>{s.term}</dt>
          <dd>{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}
