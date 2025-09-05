"use client";
import { useState, useRef, useEffect } from "react";

interface DropdownOption {
  id: string;
  label: string;
  icon?: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: string;
  className?: string;
}

export default function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select...",
  icon,
  className = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionId: string) => {
    onChange(optionId);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-left shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon && <span className="text-lg">{icon}</span>}
            <span className="text-gray-900 dark:text-white font-medium">
              {selectedOption ? (
                <span className="flex items-center space-x-2">
                  {selectedOption.icon && <span>{selectedOption.icon}</span>}
                  <span>{selectedOption.label}</span>
                </span>
              ) : (
                placeholder
              )}
            </span>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 ${
                value === option.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-900 dark:text-white'
              }`}
            >
              <div className="flex items-center space-x-2">
                {option.icon && <span className="text-lg">{option.icon}</span>}
                <span className="font-medium">{option.label}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}