import React, { useState } from 'react';
import { Lock, Unlock, Battery, Key, ShieldAlert, CheckCircle2, History, Copy, Clock, RefreshCw } from 'lucide-react';
import { SmartLockDevice } from '../types';

interface LockManagerProps {
  locks: SmartLockDevice[];
  onUpdateLock: (updated: SmartLockDevice) => void;
  onAddLog: (msg: string, deviceType: 'lock', severity: 'info' | 'warning' | 'critical') => void;
}

export const LockManager: React.FC<LockManagerProps> = ({ locks, onUpdateLock, onAddLog }) => {
  const [copiedPinId, setCopiedPinId] = useState<string | null>(null);

  const toggleLock = (lock: SmartLockDevice) => {
    const updated = { ...lock, isLocked: !lock.isLocked };
    onUpdateLock(updated);
    
    // Add logs
    onAddLog(
      `Zamek "${lock.name}": drzwi zostały ${updated.isLocked ? 'ZABLOKOWANE' : 'ODBLOKOWANE'} zdalnie`,
      'lock',
      updated.isLocked ? 'info' : 'warning'
    );
  };

  const handleGenerateNewPin = (lock: SmartLockDevice) => {
    // Generate code
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
    const updated = { ...lock, tempPin: randomPin };
    onUpdateLock(updated);
    
    onAddLog(
      `Zamek "${lock.name}": wygenerowano nowy tymczasowy kod wejściowy dla gościa: ${randomPin}`,
      'lock',
      'info'
    );
  };

  const handleCopyPin = (lock: SmartLockDevice) => {
    navigator.clipboard.writeText(lock.tempPin);
    setCopiedPinId(lock.id);
    setTimeout(() => {
      setCopiedPinId(null);
    }, 2000);
  };

  const handleDelayChange = (lock: SmartLockDevice, seconds: number) => {
    const updated = { ...lock, autoLockDelay: seconds };
    onUpdateLock(updated);
  };

  return (
    <div className="bg-white rounded-3xl border border-zinc-100 shadow-3xs p-6 flex flex-col h-full" id="lock-section-container">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-zinc-50 text-zinc-900 border border-zinc-150 rounded-2xl">
            <Lock className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <h2 className="font-extrabold text-zinc-950 text-base md:text-lg tracking-tight">
              Inteligentne Klamki i Rygle
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">Zdalne ryglowanie drzwi wejściowych, stan baterii i dostęp mobilny</p>
          </div>
        </div>

        {/* Global status of locking */}
        <div className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider">
          <Key className="w-3.5 h-3.5" />
          Bezpieczna łączność Twój SMART Home
        </div>
      </div>

      {/* Main Locks Grid list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        {locks.map(lock => {
          const isLosingBattery = lock.battery < 20;

          return (
            <div
              key={lock.id}
              className={`rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 relative ${
                lock.isLocked 
                  ? 'border-zinc-100 bg-white shadow-2xs' 
                  : 'border-amber-200 bg-zinc-50/50 ring-2 ring-amber-100/45 shadow-3xs'
              }`}
              id={`lock-card-${lock.id}`}
            >
              {/* Header Details */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wide text-zinc-900 leading-snug">{lock.name}</h4>
                  <p className="text-[11px] text-zinc-400 capitalize mt-0.5">Strefa: {lock.location}</p>
                </div>
                
                {/* Battery status */}
                <div className={`flex items-center gap-1 text-[10px] font-mono font-bold ${isLosingBattery ? 'text-red-500' : 'text-zinc-500'}`}>
                  <Battery className="w-3.5 h-3.5" />
                  {lock.battery}%
                </div>
              </div>

              {/* Centered Lock State Indicator Button with beautiful animation */}
              <div className="flex flex-col items-center justify-center my-4 py-4 bg-zinc-50/50 border border-zinc-100 rounded-xl p-4">
                <button
                  onClick={() => toggleLock(lock)}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-3xs ${
                    lock.isLocked
                      ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                      : 'bg-amber-500 text-white hover:bg-amber-600 animate-pulse'
                  }`}
                  id={`lock-circle-btn-${lock.id}`}
                  title={lock.isLocked ? 'Kliknij, aby odblokować' : 'Kliknij, aby zablokować'}
                >
                  {lock.isLocked ? (
                    <Lock className="w-6 h-6 stroke-[1.75]" />
                  ) : (
                    <Unlock className="w-6 h-6 stroke-[1.75]" />
                  )}
                </button>
                
                <span className={`text-[10px] font-bold mt-3 uppercase tracking-wider ${lock.isLocked ? 'text-zinc-700' : 'text-amber-700 font-extrabold animate-pulse'}`}>
                  {lock.isLocked ? 'ZARYGLOWANE' : 'OTWARTE DRZWI'}
                </span>
                
                <p className="text-[10px] font-mono text-zinc-400 mt-1">
                  Identyfikator: {lock.lastUnlockedBy || 'Zamek systemowy'}
                </p>
              </div>

              {/* Temporary Guest PIN Generator */}
              <div className="bg-white p-3.5 rounded-xl border border-dashed border-zinc-200 flex flex-col gap-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-zinc-400" /> Kod dla gości (PIN)
                  </span>
                  
                  <button
                    onClick={() => handleGenerateNewPin(lock)}
                    className="p-1 hover:bg-zinc-50 rounded text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer"
                    title="Wygeneruj nowy PIN"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between bg-zinc-50 border border-zinc-100 p-2.5 rounded-xl">
                  <span className="font-mono text-xs font-bold tracking-widest text-zinc-900 bg-white px-2.5 py-1 rounded border border-zinc-150 shadow-3xs">
                    {lock.tempPin}
                  </span>

                  <button
                    onClick={() => handleCopyPin(lock)}
                    className="py-1 px-2.5 bg-zinc-900 hover:bg-zinc-800 text-[10px] rounded-lg font-bold text-white flex items-center gap-1 transition-all cursor-pointer"
                    id={`copy-pin-btn-${lock.id}`}
                  >
                    {copiedPinId === lock.id ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> SKOPIOWANO
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> KOPIUJ
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* AutoLock slider Delay */}
              <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between text-[11px]">
                <span className="text-zinc-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-zinc-400" /> Auto-ryglowanie za:</span>
                <div className="flex items-center gap-1.5">
                  <select
                    value={lock.autoLockDelay}
                    onChange={(e) => handleDelayChange(lock, Number(e.target.value))}
                    className="bg-zinc-100 border border-zinc-200/50 rounded-lg px-2 py-1 font-mono text-zinc-700 text-[10px] font-bold focus:outline-none"
                  >
                    <option value="15">15s</option>
                    <option value="30">30s</option>
                    <option value="60">1 min</option>
                    <option value="120">2 min</option>
                    <option value="300">5 min</option>
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
