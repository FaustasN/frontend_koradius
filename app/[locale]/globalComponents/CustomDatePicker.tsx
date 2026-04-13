import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
 import { useTranslations } from 'next-intl';
interface CustomDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  minDate?: string;
  placeholder?: string;
  className?: string;
  error?: string;
}

const parseLocalYMD = (val: string): Date | null => {
  const isYMD = /^\d{4}-\d{2}-\d{2}$/.test(val);
  if (!isYMD) return null;
  const [y, m, d] = val.split('-').map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1);
  return isNaN(dt.getTime()) ? null : dt;
};

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  minDate,
  placeholder = "Pasirinkite datą",
  className = "",
  error
}) => {
  const getDateFromValue = (val: string): Date | null => {
    if (!val) return null;
    const parsed = parseLocalYMD(val) || new Date(val);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(() => getDateFromValue(value) || new Date());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedDate = getDateFromValue(value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('lt-LT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatInputValue = (date: Date): string => {
    // Format as local date (YYYY-MM-DD) to avoid UTC-based off-by-one
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateDisabled = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    
    // Always disable today
    if (normalizedDate.getTime() === today.getTime()) {
      return true;
    }
    
    // If minDate is provided, use it
    if (minDate) {
      const minDateObj = parseLocalYMD(minDate) || new Date(minDate);
      minDateObj.setHours(0, 0, 0, 0);
      return normalizedDate < minDateObj;
    }
    
    // Default: disable past dates (including today)
    return normalizedDate <= today;
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date): boolean => {
    return selectedDate ? date.toDateString() === selectedDate.toDateString() : false;
  };

  const handleDateSelect = (date: Date) => {
    onChange(formatInputValue(date));
    setIsOpen(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const disabled = isDateDisabled(date);
      const isSelectedDay = isSelected(date);
      const isTodayDay = isToday(date);

      days.push(
        <button
          key={day}
          onClick={() => !disabled && handleDateSelect(date)}
          disabled={disabled}
          className={`
            h-10 w-10 rounded-lg text-sm font-medium transition-all duration-200
            flex items-center justify-center
            ${disabled 
              ? 'text-gray-300 cursor-not-allowed bg-gray-50' 
              : isSelectedDay
                ? 'bg-teal-600 text-white shadow-lg'
                : isTodayDay
                  ? 'bg-teal-100 text-teal-700 font-bold'
                  : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600'
            }
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };


  
  const t = useTranslations('featuredTours');
    const monthNames = [
    t('common.january'), t('common.february'), t('common.march'), t('common.april'), t('common.may'), t('common.june'),
    t('common.july'), t('common.august'), t('common.september'), t('common.october'), t('common.november'), t('common.december')
  ];

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Input Field */}
      <button
        type="button"
        onClick={() => {
          if (!isOpen) {
            setCurrentMonth(selectedDate || new Date());
          }
          setIsOpen(!isOpen);
        }}
        className={`
          w-full px-4 py-3 text-left bg-white border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
          transition-all duration-200 flex items-center justify-between
          ${error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-300 hover:border-teal-400'
          }
        `}
      >
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-gray-400 mr-3" />
          <span className={selectedDate ? 'text-gray-900' : 'text-gray-500'}>
            {selectedDate ? formatDate(selectedDate) : placeholder}
          </span>
        </div>
        <ChevronRight 
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-90' : ''
          }`} 
        />
      </button>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 min-w-[320px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            
            <h3 className="text-lg font-semibold text-gray-800">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {[t('common.pr'), t('common.an'), t('common.Tr'), t('common.Kt'), t('common.Pn'), t('common.St'),t('common.Sk')].map((day) => (
              <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
