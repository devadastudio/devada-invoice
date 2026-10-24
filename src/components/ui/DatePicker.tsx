"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  label?: string;
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  minDate?: string;
  placeholder?: string;
  className?: string;
}

const MONTH_NAMES_FR = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const DAYS_HEADER = ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"];

export function DatePicker({
  label,
  value,
  onChange,
  placeholder = "Sélectionner une date",
  className,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current date value or fallback to today
  const selectedDate = value ? new Date(value + "T00:00:00") : new Date();
  const [viewYear, setViewYear] = useState<number>(selectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(selectedDate.getMonth());

  // Update view month when value changes
  useEffect(() => {
    if (value) {
      const d = new Date(value + "T00:00:00");
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, [value]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Build calendar matrix (42 cells: 6 rows of 7 days)
  const calendarDays = () => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
    const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const days = [];

    // Previous month filler days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        monthOffset: -1,
        dateStr: `${viewMonth === 0 ? viewYear - 1 : viewYear}-${String(
          viewMonth === 0 ? 12 : viewMonth
        ).padStart(2, "0")}-${String(daysInPrevMonth - i).padStart(2, "0")}`,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      days.push({
        day: i,
        monthOffset: 0,
        dateStr: `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(
          i
        ).padStart(2, "0")}`,
      });
    }

    // Next month filler days (to make 42 or 35 cells)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        monthOffset: 1,
        dateStr: `${viewMonth === 11 ? viewYear + 1 : viewYear}-${String(
          viewMonth === 11 ? 1 : viewMonth + 2
        ).padStart(2, "0")}-${String(i).padStart(2, "0")}`,
      });
    }

    return days;
  };

  const todayStr = new Date().toISOString().split("T")[0];

  const formatDisplay = (val: string) => {
    if (!val) return placeholder;
    const d = new Date(val + "T00:00:00");
    if (isNaN(d.getTime())) return val;
    return `${d.getDate()} ${MONTH_NAMES_FR[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <div className={cn("relative space-y-1.5", className)} ref={containerRef}>
      {label && (
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
          {label}
        </label>
      )}

      {/* Input Trigger Button (Matches template input_file_0.png) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-sm transition-all duration-150 shadow-sm text-left select-none",
          isOpen
            ? "border-blue-500 ring-2 ring-blue-500/20 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600"
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <CalendarIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="truncate font-medium text-xs sm:text-sm">
            {formatDisplay(value)}
          </span>
        </div>
        <ChevronsUpDown className="w-4 h-4 text-slate-400 flex-shrink-0 ml-2" />
      </button>

      {/* Popover Calendar (Matches template input_file_0.png) */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 z-50 w-72 sm:w-80 p-4 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
          {/* Header with Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Mois précédent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-bold text-sm text-slate-900 dark:text-white">
              {MONTH_NAMES_FR[viewMonth]} {viewYear}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Mois suivant"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday Labels (Su, Mo, Tu, We, Th, Fr, Sa) */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {DAYS_HEADER.map((day, i) => (
              <span
                key={i}
                className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 py-1"
              >
                {day}
              </span>
            ))}
          </div>

          {/* Day Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {calendarDays().map((item, idx) => {
              const isSelected = item.dateStr === value;
              const isToday = item.dateStr === todayStr;
              const isDifferentMonth = item.monthOffset !== 0;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onChange(item.dateStr);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "relative h-9 w-9 mx-auto rounded-xl flex items-center justify-center text-xs font-semibold transition-all",
                    isSelected
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105 z-10"
                      : isDifferentMonth
                      ? "text-slate-300 dark:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      : isToday
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  <span>{item.day}</span>
                  {/* Subtle dot indicator for today when not selected */}
                  {isToday && !isSelected && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
