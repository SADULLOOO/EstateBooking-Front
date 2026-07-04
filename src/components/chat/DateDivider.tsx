interface DateDividerProps {
  label: string;
}

export function DateDivider({ label }: DateDividerProps) {
  return (
    <div className="date-divider">
      <span>{label}</span>
    </div>
  );
}
