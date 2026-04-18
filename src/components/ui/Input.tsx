import React from 'react';
import { clsx } from 'clsx';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-zinc-400">{label}</label>}
      <input
        {...props}
        className={clsx(
          'bg-zinc-800 border rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent',
          error ? 'border-red-600' : 'border-zinc-600',
          className,
        )}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> & {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
};

export function Select({ label, error, options, placeholder, className, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-zinc-400">{label}</label>}
      <select
        {...props}
        className={clsx(
          'bg-zinc-800 border rounded-lg px-3 py-2 text-sm text-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent',
          error ? 'border-red-600' : 'border-zinc-600',
          className,
        )}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
