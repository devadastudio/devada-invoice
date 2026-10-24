"use client";

import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, Plus, Users, Building2, UserX } from "lucide-react";
import { Client } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface ClientSelectDropdownProps {
  label?: string;
  clients: Client[];
  selectedClientId: string; // "" means "Aucune sélection"
  onChange: (clientId: string) => void;
  onAddNewClient?: () => void;
  className?: string;
}

export function ClientSelectDropdown({
  label = "Facturé au client",
  clients,
  selectedClientId,
  onChange,
  onAddNewClient,
  className,
}: ClientSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside to close
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

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  return (
    <div className={cn("relative space-y-1.5", className)} ref={containerRef}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {label} <span className="text-rose-500">*</span>
          </label>
          <span className="text-[10px] text-slate-400">
            {selectedClient ? selectedClient.city : "Requis pour émettre"}
          </span>
        </div>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-sm transition-all duration-150 shadow-sm text-left select-none",
          isOpen
            ? "border-blue-500 ring-2 ring-blue-500/20 bg-white dark:bg-slate-900"
            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600"
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {selectedClient ? (
            <>
              <div
                className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-xs text-white shadow-sm ring-1 ring-black/10 flex-shrink-0",
                  selectedClient.avatarBg || "bg-blue-600"
                )}
              >
                {selectedClient.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {selectedClient.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {selectedClient.email || selectedClient.phone}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center flex-shrink-0">
                <UserX className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm text-slate-400">
                Aucune sélection
              </span>
            </>
          )}
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-slate-400 flex-shrink-0 ml-2 transition-transform duration-200",
            isOpen && "rotate-180 text-blue-600"
          )}
        />
      </button>

      {/* Popover Menu (Matches template input_file_1.png) */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 z-50 w-full min-w-[280px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 py-1.5 animate-in fade-in zoom-in-95 duration-150">
          {/* Header Title */}
          <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Clients disponibles
            </p>
          </div>

          <div className="py-1 max-h-60 overflow-y-auto">
            {/* 1ère Option: Aucune sélection */}
            <button
              type="button"
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className={cn(
                "w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors",
                selectedClientId === ""
                  ? "bg-blue-50/60 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
              )}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                  <UserX className="w-3.5 h-3.5" />
                </div>
                <span className="italic">Aucune sélection</span>
              </div>
              {selectedClientId === "" && (
                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              )}
            </button>

            {/* Client List */}
            {clients.map((client) => {
              const isSelected = selectedClientId === client.id;
              return (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => {
                    onChange(client.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors",
                    isSelected
                      ? "bg-blue-50/60 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-md flex items-center justify-center font-extrabold text-[10px] text-white shadow-sm ring-1 ring-black/10 flex-shrink-0",
                        client.avatarBg || "bg-blue-600"
                      )}
                    >
                      {client.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">
                        {client.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {client.city} • {client.phone}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Action: + Nouveau client (Matches template input_file_1.png) */}
          {onAddNewClient && (
            <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 px-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onAddNewClient();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Nouveau client</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
