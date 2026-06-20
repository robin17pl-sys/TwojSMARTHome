import React from 'react';
import { ToggleLeft, ToggleRight, Zap, RefreshCw, HelpCircle, Flame, Lock, Droplet, Sun, BellRing } from 'lucide-react';

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  isActive: boolean;
  type: 'lock' | 'flood' | 'lighting' | 'alarm';
}

interface AutomationSectionProps {
  rules: AutomationRule[];
  onToggleRule: (id: string) => void;
  onAddLog: (msg: string, deviceType: 'alarm', severity: 'info' | 'warning' | 'critical') => void;
}

export const AutomationSection: React.FC<AutomationSectionProps> = ({ rules, onToggleRule, onAddLog }) => {
  const handleToggle = (id: string, name: string, activeState: boolean) => {
    onToggleRule(id);
    onAddLog(
      `Scenariusz automatyzacji "${name}": ${!activeState ? 'AKTYWOWANY' : 'ZAWIESZONY'}`,
      'alarm',
      'info'
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-zinc-100 shadow-3xs p-6 flex flex-col h-full" id="automation-section-container">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-zinc-50 text-zinc-900 border border-zinc-150 rounded-2xl">
            <Zap className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <h2 className="font-extrabold text-zinc-950 text-base md:text-lg tracking-tight">
              Scenariusze Automatyzacji i Sceny
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">Automatyczne reguły reagowania czujników i urządzeń wykonawczych</p>
          </div>
        </div>
        
        <div className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider">
          <RefreshCw className="w-3.5 h-3.5" />
          Silnik SmartRule Active
        </div>
      </div>

      {/* Rules list layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
        {rules.map(rule => {
          const isLockType = rule.type === 'lock';
          const isFloodType = rule.type === 'flood';
          const isLightType = rule.type === 'lighting';

          return (
            <div
              key={rule.id}
              className={`rounded-2xl p-4.5 border transition-all duration-300 relative flex flex-col justify-between ${
                rule.isActive 
                  ? 'border-zinc-300 bg-white shadow-3xs' 
                  : 'border-zinc-100 bg-zinc-50/20 opacity-70'
              }`}
              id={`automation-rule-card-${rule.id}`}
            >
              <div className="space-y-3">
                {/* Header icon + toggle button row */}
                <div className="flex items-start justify-between">
                  {/* Category icon */}
                  <div className={`p-2 rounded-xl border ${
                    rule.isActive 
                      ? 'bg-zinc-900 text-white border-zinc-900' 
                      : 'bg-zinc-100 text-zinc-400 border-zinc-100'
                  }`}>
                    {isLockType ? (
                      <Lock className="w-4 h-4" />
                    ) : isFloodType ? (
                      <Droplet className="w-4 h-4" />
                    ) : isLightType ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <BellRing className="w-4 h-4" />
                    )}
                  </div>

                  {/* Toggle switch with motion feel */}
                  <button
                    onClick={() => handleToggle(rule.id, rule.name, rule.isActive)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out font-bold cursor-pointer ${
                      rule.isActive ? 'bg-zinc-900' : 'bg-zinc-200'
                    }`}
                    id={`toggle-rule-btn-${rule.id}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        rule.isActive ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Automation info description */}
                <div>
                  <h4 className={`text-xs font-extrabold uppercase tracking-wide ${rule.isActive ? 'text-zinc-900' : 'text-zinc-500'}`}>{rule.name}</h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-normal">{rule.description}</p>
                </div>
              </div>

              {/* Status details flow visualization */}
              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[9px] font-mono font-bold tracking-wider text-zinc-505">
                <span className="bg-zinc-100 px-2 py-0.5 rounded-md truncate max-w-[100px]" title={rule.trigger}>
                  IF: {rule.trigger}
                </span>
                <span className="text-zinc-300">➔</span>
                <span className={`px-2 py-0.5 rounded-md truncate max-w-[100px] ${rule.isActive ? 'bg-zinc-900 text-white font-bold' : 'bg-zinc-100'}`} title={rule.action}>
                  DO: {rule.action}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer information bar */}
      <div className="mt-5 p-3.5 bg-zinc-50/50 rounded-2xl border border-zinc-100 text-zinc-500 text-xs flex gap-2 items-start leading-relaxed shadow-3xs">
        <HelpCircle className="w-4 h-4 text-zinc-405 shrink-0 mt-0.5" />
        <span>
          <strong>Tryb SmartRule:</strong> Wszystkie procesy integrowane są w czasie rzeczywistym. Przy aktywnej funkcji <strong>"Odcięcie wody"</strong> przekroczenie krytycznego poziomu wilgoci uaktywni procedurę ryglowania wszystkich zamków elektromechanicznych.
        </span>
      </div>
    </div>
  );
};
