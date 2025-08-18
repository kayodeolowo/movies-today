"use client";

interface CategoryTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "now_playing", label: "Now Playing" },
  { id: "popular", label: "Popular" },
  { id: "top_rated", label: "Top Rated" },
];

export default function CategoryTabs({ activeTab, onTabChange }: CategoryTabsProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-full p-1 space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-6 py-2 rounded-full transition-all duration-200 font-medium ${
              activeTab === tab.id
                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}