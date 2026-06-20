import React, { useState } from 'react';
import { Shield, ShieldAlert, Bell, BellOff, Volume2, LockKeyhole, Logs, RefreshCw, Flame, Wind, Eye, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { AlarmSystem, LogEvent, DeviceType } from '../types';

interface AlarmManagerProps {
  alarm: AlarmSystem;
  logs: LogEvent[];
  onUpdateAlarm: (updated: AlarmSystem) => void;
  onClearSiren: () => void;
  onClearLogs: () => void;
  onAddLog: (msg: string, deviceType: 'alarm', severity: 'info' | 'warning' | 'critical') => void;
}

export const AlarmManager: React.FC<AlarmManagerProps> = ({
  alarm,
  logs,
  onUpdateAlarm,
  onClearSiren,
  onClearLogs,
  onAddLog,
}) => {
  const [enteredCode, setEnteredCode] = useState<string>('');
  const [keypadMessage, setKeypadMessage] = useState<string>('Wpisz kod PIN');
  const [keypadError, setKeypadError] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<DeviceType | 'all'>('all');

  const handleKeyPress = (num: string) => {
    if (enteredCode.length < 4) {
      const next = enteredCode + num;
      setEnteredCode(next);
      setKeypadError(false);

      if (next.length === 4) {
        if (next === alarm.code) {
          // Success code
          setKeypadMessage('KOD POPRAWNY');
          setTimeout(() => {
            if (alarm.isSirenTriggered) {
              onClearSiren();
            }
            // Disarm System
            onUpdateAlarm({
              ...alarm,
              mode: 'disarmed',
              isSirenTriggered: false
            });
            onAddLog('Sygnalizator akustyczny wyłączony. System alarmowy rozbrojony', 'alarm', 'info');
            setEnteredCode('');
            setKeypadMessage('System rozbrojony');
          }, 600);
        } else {
          // Wrong code
          setKeypadError(true);
          setKeypadMessage('BŁĘDNY KOD!');
          setTimeout(() => {
            setEnteredCode('');
            setKeypadMessage('Wpisz kod PIN (Domyślny: 1234)');
            setKeypadError(false);
          }, 1500);
        }
      }
    }
  };

  const handleClearKeypad = () => {
    setEnteredCode('');
    setKeypadMessage('Wpisz kod PIN');
    setKeypadError(false);
  };

  const handleArm = (targetMode: 'armed_stay' | 'armed_away') => {
    onUpdateAlarm({
      ...alarm,
      mode: targetMode
    });
    onAddLog(
      `Uzbrojono system alarmowy w trybie: ${
        targetMode === 'armed_away' ? 'Pełna ochrona (Wyjazd)' : 'Ochrona nocna (Dom)'
      }`,
      'alarm',
      'info'
    );
  };

  const triggerPanic = () => {
    onUpdateAlarm({
      ...alarm,
      isSirenTriggered: true
    });
    onAddLog('ALARM RĘCZNY PANIC! Uruchomiono syreny alarmowe w całym obiekcie', 'alarm', 'critical');
  };

  const filteredLogs = logs.filter(l => filterType === 'all' || l.deviceType === filterType);

  return (
    <div className="bg-white rounded-3xl border border-zinc-100 shadow-3xs p-6 flex flex-col h-full" id="alarm-section-container">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-zinc-50 text-zinc-900 border border-zinc-150 rounded-2xl">
            <Shield className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <h2 className="font-extrabold text-zinc-950 text-base md:text-lg tracking-tight">
              Centrum Alarmowe i Dziennik
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">Zarządzanie uzbrojeniem, sensory dymu i pełna kronika telemetryczna</p>
          </div>
        </div>

        {/* Dynamic header mode banner */}
        <div
          className={`self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
            alarm.isSirenTriggered
              ? 'bg-red-50 text-red-700 border border-red-200 animate-pulse'
              : alarm.mode === 'disarmed'
              ? 'bg-zinc-50 text-zinc-600 border border-zinc-150'
              : 'bg-zinc-950 text-white'
          }`}
        >
          {alarm.isSirenTriggered ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5" />
              ALARM AKTYWNY!
            </>
          ) : alarm.mode === 'disarmed' ? (
            'System Rozbrojony'
          ) : alarm.mode === 'armed_stay' ? (
            'Uzbrojenie Domowe'
          ) : (
            'Pełne Uzbrojenie'
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Core detectors + Keypad panel */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          
          {/* Detectors row of safety */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-2xl border flex items-center justify-between transition-colors ${
              alarm.smokeDetectorSafe ? 'bg-zinc-50/50 border-zinc-100' : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl border ${alarm.smokeDetectorSafe ? 'bg-white border-zinc-100 text-zinc-800' : 'bg-red-100 text-red-700'}`}>
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-zinc-800">Czujnik dymu</h5>
                  <p className="text-[10px] text-zinc-400">Czujka aktywna</p>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-zinc-800" />
            </div>

            <div className={`p-4 rounded-2xl border flex items-center justify-between transition-colors ${
              alarm.coDetectorSafe ? 'bg-zinc-50/50 border-zinc-100' : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl border ${alarm.coDetectorSafe ? 'bg-white border-zinc-100 text-zinc-800' : 'bg-red-100 text-red-700'}`}>
                  <Wind className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-zinc-800">Detektor CO</h5>
                  <p className="text-[10px] text-zinc-400">Norma (0 ppm)</p>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-zinc-800" />
            </div>
          </div>

          {/* Alarm system siren flashing widget */}
          {alarm.isSirenTriggered && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between text-red-700 leading-snug animate-pulse">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-8 h-8 text-red-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-extrabold tracking-tight uppercase">Sygnalizator Dźwiękowy Aktywny</h4>
                  <p className="text-xs text-red-600/90">Wprowadź kod PIN <strong>1234</strong> aby rozbroić!</p>
                </div>
              </div>
              <Volume2 className="w-5 h-5 animate-bounce text-red-600 shrink-0" />
            </div>
          )}

          {/* Interactive virtual Keypad and console panel */}
          <div className="bg-zinc-50 border border-zinc-100/80 rounded-3xl p-5 flex flex-col md:flex-row gap-5">
            
            {/* Left side info & quick mode buttons */}
            <div className="flex-1 flex flex-col justify-between gap-4">
              <div>
                <h4 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <LockKeyhole className="w-4 h-4 text-zinc-500" /> Uzbrojenie systemu
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Zabezpiecz dom na noc (ochrona wybranych wejść) lub włącz pełne monitorowanie czujek wewnętrznych na czas wyjazdu.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleArm('armed_stay')}
                  disabled={alarm.mode === 'armed_stay' || alarm.isSirenTriggered}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    alarm.mode === 'armed_stay'
                      ? 'bg-zinc-900 text-white shadow-sm'
                      : 'bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200'
                  }`}
                  id="arm-stay-btn"
                >
                  <Shield className="w-4 h-4" />
                  Uzbrój tryb nocny
                </button>

                <button
                  onClick={() => handleArm('armed_away')}
                  disabled={alarm.mode === 'armed_away' || alarm.isSirenTriggered}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    alarm.mode === 'armed_away'
                      ? 'bg-zinc-900 text-white shadow-sm'
                      : 'bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200'
                  }`}
                  id="arm-away-btn"
                >
                  <LockKeyhole className="w-4 h-4" />
                  Uzbrój pełny wyjazd
                </button>

                <button
                  onClick={triggerPanic}
                  className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  id="panic-trigger-btn"
                >
                  <ShieldAlert className="w-4 h-4 animate-pulse" />
                  URUCHOM ALARM (PANIC)
                </button>
              </div>
            </div>

            {/* Right side Touch Keypad */}
            <div className="bg-zinc-950 text-white rounded-2xl p-4 flex flex-col justify-between w-64 mx-auto md:mx-0 shadow-xs border border-zinc-900">
              <div className="text-center mb-3">
                <div
                  className={`py-2 px-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-center ${
                    keypadError ? 'bg-red-950/80 text-red-400' : 'bg-zinc-900 text-zinc-300'
                  }`}
                >
                  {keypadMessage}
                </div>
                
                {/* Visual PIN circles inputs indicators */}
                <div className="flex justify-center gap-2.5 mt-3">
                  {[0, 1, 2, 3].map((idx) => (
                    <span
                      key={idx}
                      className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
                        idx < enteredCode.length
                          ? 'bg-white border-white scale-110 shadow-xs'
                          : 'bg-transparent border-zinc-800'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Pin key buttons layout */}
              <div className="grid grid-cols-3 gap-1.5 text-zinc-300 font-mono">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleKeyPress(num)}
                    disabled={keypadMessage === 'KOD POPRAWNY'}
                    className="py-2 hover:bg-zinc-900 active:bg-zinc-800 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                  >
                    {num}
                  </button>
                ))}
                
                <button
                  onClick={handleClearKeypad}
                  className="py-2 hover:bg-zinc-900 text-red-400 text-[10px] font-bold rounded-xl cursor-pointer transition-colors"
                >
                  CLEAR
                </button>
                
                <button
                  onClick={() => handleKeyPress('0')}
                  disabled={keypadMessage === 'KOD POPRAWNY'}
                  className="py-2 hover:bg-zinc-900 active:bg-zinc-800 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  0
                </button>

                <div className="text-[9px] text-zinc-650 font-sans flex items-center justify-center font-bold">
                  PIN: 1234
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live event Log history on the right */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-zinc-50/40 rounded-2xl p-4 border border-zinc-100 max-h-[440px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                <Logs className="w-4 h-4 text-zinc-500" /> Dziennik zdarzeń
              </h4>
              <button
                onClick={onClearLogs}
                className="text-[10px] text-zinc-400 hover:text-red-500 font-bold cursor-pointer transition-colors"
              >
                Wyczyść logi
              </button>
            </div>

            {/* Chips filters for devices log context */}
            <div className="flex flex-wrap gap-1">
              {(['all', 'camera', 'flood', 'lighting', 'lock', 'alarm'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                    filterType === type
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  {type === 'all' ? 'Wszystkie' : type === 'camera' ? 'Kamery' : type === 'flood' ? 'Zalanie' : type === 'lighting' ? 'Światło' : type === 'lock' ? 'Klamki' : 'Alarm'}
                </button>
              ))}
            </div>

            {/* Scrollable log list */}
            <div className="space-y-2 overflow-y-auto max-h-[250px] pr-1">
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => {
                  const isWarning = log.severity === 'warning';
                  const isCritical = log.severity === 'critical';

                  return (
                    <div
                      key={log.id}
                      className={`text-xs p-2.5 rounded-xl border flex gap-2 font-medium transition-all ${
                        isCritical
                          ? 'bg-red-50/80 text-red-900 border-red-100'
                          : isWarning
                          ? 'bg-amber-50/80 text-amber-900 border-amber-100'
                          : 'bg-white text-zinc-700 border-zinc-100 shadow-3xs'
                      }`}
                    >
                      <span className="text-zinc-400 font-mono text-[9px] shrink-0 mt-0.5">{log.time}</span>
                      <div className="flex-1">
                        <span className="font-extrabold block uppercase text-[8px] text-zinc-400 mb-0.5 tracking-wider font-sans">
                          {log.deviceType === 'camera' ? 'Kamera' : log.deviceType === 'flood' ? 'Zalanie' : log.deviceType === 'lighting' ? 'Oświetlenie' : log.deviceType === 'lock' ? 'Zamki' : 'Alarm'}
                        </span>
                        <p className="leading-relaxed text-[11px] font-sans text-zinc-805">{log.message}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-zinc-400 text-xs">
                  Brak zarejestrowanych logów
                </div>
              )}
            </div>
          </div>

          <div className="text-[9px] text-zinc-400 border-t border-zinc-100 pt-3 flex justify-between items-center bg-transparent mt-3">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-zinc-800" /> Szyfrowanie stacji AES-256
            </span>
            <span className="font-mono text-zinc-400">SMARTSEC v3.5</span>
          </div>
        </div>
      </div>
    </div>
  );
};
