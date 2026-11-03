
import type { UserSettings } from '../types/index.ts';
import PreferencesSection from '../components/settings/PreferencesSection.tsx';
import CurrencySection from '../components/settings/CurrencySection.tsx';
import CategoriesSection from '../components/settings/CategoriesSection.tsx';
import AccountsSection from '../components/settings/AccountsSection.tsx';
import BudgetsSection from '../components/settings/BudgetsSection.tsx';

type ThemeMode = 'light' | 'dark';

interface Props {
  year: number;
  month: number;
  settings: UserSettings;
  onUpdate: (patch: Partial<UserSettings>) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export default function SettingsPage({
  year,
  month,
  settings,
  onUpdate,
  theme,
  onThemeChange,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-base font-semibold text-text-primary">
          Appearance
        </h2>

        <p className="mt-1 text-sm text-text-muted">
          Choose your preferred appearance.
        </p>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => onThemeChange('light')}
            aria-pressed={theme === 'light'}
            className={`rounded-lg border px-5 py-2 text-sm font-medium transition-colors ${
              theme === 'light'
                ? 'border-accent bg-accent-soft text-accent'
                : 'border-border text-text-muted hover:bg-bg'
            }`}
          >
            ☀️ Light
          </button>

          <button
            type="button"
            onClick={() => onThemeChange('dark')}
            aria-pressed={theme === 'dark'}
            className={`rounded-lg border px-5 py-2 text-sm font-medium transition-colors ${
              theme === 'dark'
                ? 'border-accent bg-accent-soft text-accent'
                : 'border-border text-text-muted hover:bg-bg'
            }`}
          >
            🌙 Dark
          </button>
        </div>
      </section>

      <PreferencesSection settings={settings} onUpdate={onUpdate} />

      <CurrencySection settings={settings} onUpdate={onUpdate} />

      <CategoriesSection />

      <AccountsSection settings={settings} />

      <BudgetsSection
        year={year}
        month={month}
        settings={settings}
      />
    </div>
  );
}
