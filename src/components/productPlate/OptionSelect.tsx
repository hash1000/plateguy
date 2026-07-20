"use client";

interface Option {
  value: string;
  label: string;
}

interface OptionSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
}

export default function OptionSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Choose an option",
}: OptionSelectProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-200">
      <label className="text-sm font-bold uppercase tracking-wide text-gray-700">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-56 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
