'use client';

const TABS = ['Users', 'Integrations', 'Notifications'];

interface SettingsHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onReset: () => void;
  onRemoveAll: () => void;
  onPasteEmails?: () => void;
}

export function SettingsHeader({
  activeTab,
  onTabChange,
  onReset,
  onRemoveAll,
  onPasteEmails,
}: SettingsHeaderProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <div className="flex gap-3">
          {onPasteEmails && (
            <button
              onClick={onPasteEmails}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50 hover:text-gray-900 transition-colors"
              title="Paste sample emails into invite input"
            >
              Paste Emails
            </button>
          )}
          <button
            onClick={onReset}
            className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50 hover:text-gray-900 transition-colors"
            title="Reset to default users"
          >
            Reset Defaults
          </button>
          <button 
            onClick={onRemoveAll}
            className="px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-200 rounded hover:bg-red-50 transition-colors"
            title="Remove all users"
          >
            Remove All
          </button>
        </div>
      </div>
      <div className="flex gap-8 border-b border-gray-200">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`
              pb-3 text-sm font-medium transition-colors relative
              ${activeTab === tab 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
