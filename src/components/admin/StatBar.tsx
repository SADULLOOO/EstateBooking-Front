interface StatBarProps {
  label: string;
  count: number;
  total: number;
}

export function StatBar({ label, count, total }: StatBarProps) {
  const percent = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="stat-bar">
      <div className="stat-bar__label">
        <span>{label}</span>
        <span>
          {count} ({percent}%)
        </span>
      </div>
      <div className="stat-bar__track">
        <div className="stat-bar__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
