import React from 'react';
import { Droplet, Battery, ShieldAlert, CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import { FloodSensorDevice } from '../types';

interface FloodManagerProps {
  sensors: FloodSensorDevice[];
  onUpdateSensor: (updated: FloodSensorDevice) => void;
  onTriggerAlarmOnSiren: (sensorName: string) => void;
  onClearAlarmOnSiren: () => void;
  onAddLog: (msg: string, deviceType: 'flood', severity: 'info' | 'warning' | 'critical') => void;
  alarmActive: boolean;
}

export const FloodManager: React.FC<FloodManagerProps> = ({
  sensors,
  onUpdateSensor,
  onTriggerAlarmOnSiren,
  onClearAlarmOnSiren,
  onAddLog,
  alarmActive
}) => {
  const handleModifyMoisture = (sensor: FloodSensorDevice, level: number) => {
    let newStatus: 'safe' | 'leak' = level > 60 ? 'leak' : 'safe';
    
    // Create the updated object
    const updated: FloodSensorDevice = {
      ...sensor,
      moistureLevel: level,
      status: newStatus,
      lastChecked: 'Teraz'
    };

    onUpdateSensor(updated);

    // If status transitioned to leak, communicate to parent state to run siren
    if (newStatus === 'leak' && sensor.status === 'safe') {
      onTriggerAlarmOnSiren(sensor.name);
      onAddLog(
        `ALARM ZALANIA! Czujnik "${sensor.name}" wykrył niepokojąco wysoki poziom wilgotności (${level}%)`,
        'flood',
        'critical'
      );
    } else if (newStatus === 'safe' && sensor.status === 'leak') {
      // Check if there are other leaking sensors before clearing
      const otherLeaks = sensors.filter(s => s.id !== sensor.id && s.status === 'leak');
      if (otherLeaks.length === 0) {
        onClearAlarmOnSiren();
      }
      onAddLog(
        `Czujnik "${sensor.name}": przywrócono stan bezpieczny (${level}% wilgotności)`,
        'flood',
        'info'
      );
    }
  };

  const handleSimulateLeak = (sensor: FloodSensorDevice) => {
    handleModifyMoisture(sensor, 95);
  };

  const handleResetSensor = (sensor: FloodSensorDevice) => {
    handleModifyMoisture(sensor, 12);
  };

  const anyLeaks = sensors.some(s => s.status === 'leak');

  return (
    <div className="bg-white rounded-3xl border border-zinc-100 shadow-3xs p-6 flex flex-col h-full" id="flood-section-container">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-zinc-50 text-zinc-900 border border-zinc-150 rounded-2xl">
            <Droplet className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <h2 className="font-extrabold text-zinc-950 text-base md:text-lg tracking-tight">
              Czujniki zalań
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">Analiza wilgotności i detekcja ulatniania wody w strefach ryzyka</p>
          </div>
        </div>
        
        {anyLeaks ? (
          <div className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            Wykryto awarię!
          </div>
        ) : (
          <div className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 border border-zinc-150 rounded-xl text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            Stan poprawny
          </div>
        )}
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 flex-1">
        {sensors.map(sensor => {
          const isLosingBattery = sensor.battery < 30;
          const isLeaking = sensor.status === 'leak';

          return (
            <div
              key={sensor.id}
              className={`rounded-2xl p-5 border relative transition-all duration-300 ${
                isLeaking
                  ? 'border-red-400 bg-red-50/40 shadow-xs ring-4 ring-red-100'
                  : 'border-slate-100 hover:border-slate-200 bg-slate-50/30'
              }`}
              id={`flood-sensor-card-${sensor.id}`}
            >
              {/* Card Header details */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wide text-zinc-900 leading-snug">{sensor.name}</h4>
                  <p className="text-[11px] text-zinc-400 capitalize mt-0.5">Pokój: {sensor.location}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Battery level status */}
                  <div className={`flex items-center gap-1 text-[10px] font-mono font-bold ${isLosingBattery ? 'text-red-500' : 'text-zinc-500'}`}>
                    <Battery className="w-3.5 h-3.5" />
                    {sensor.battery}%
                  </div>
                </div>
              </div>

              {/* Progress level slider gauge */}
              <div className="mb-5 bg-white rounded-xl p-3 border border-zinc-100 shadow-3xs">
                <div className="flex justify-between text-[11px] mb-1.5 font-bold">
                  <span className="text-zinc-550 uppercase tracking-wide text-[9px]">Poziom wilgoci</span>
                  <span className={`font-mono font-bold ${isLeaking ? 'text-red-650' : 'text-zinc-800'}`}>
                    {sensor.moistureLevel}%
                  </span>
                </div>

                {/* Progress bar and simulated slider input */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sensor.moistureLevel}
                  onChange={(e) => handleModifyMoisture(sensor, Number(e.target.value))}
                  className="w-full h-1 bg-zinc-100 outline-none rounded-lg appearance-none cursor-pointer accent-zinc-900"
                  id={`flood-sensor-slider-${sensor.id}`}
                />
                
                {/* Visual indicator bar */}
                <div className="w-full bg-zinc-100 h-1 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${isLeaking ? 'bg-red-500' : 'bg-zinc-800'}`}
                    style={{ width: `${sensor.moistureLevel}%` }}
                  />
                </div>
              </div>

              {/* Status and simulate actions buttons */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Kontrola stanu:</span>
                  <span className="font-bold">{sensor.lastChecked}</span>
                </div>
                
                {isLeaking ? (
                  <button
                    onClick={() => handleResetSensor(sensor)}
                    className="w-full py-2 bg-zinc-900 hover:bg-zinc-805 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-3xs"
                    id={`reset-sensor-btn-${sensor.id}`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Wysusz czujnik (Reset)
                  </button>
                ) : (
                  <button
                    onClick={() => handleSimulateLeak(sensor)}
                    className="w-full py-2 bg-red-50 hover:bg-red-105 text-red-650 rounded-xl text-xs font-bold border border-red-200/50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    id={`simulate-leak-btn-${sensor.id}`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Symuluj wyciek wody
                  </button>
                )}
              </div>

              {/* Red warning border banner for leaks */}
              {isLeaking && (
                <div className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Footer warning helper */}
      <div className="mt-4 p-3 bg-zinc-50/50 rounded-2xl border border-zinc-100 text-zinc-500 text-xs flex gap-2 items-start leading-relaxed shadow-3xs">
        <HelpCircle className="w-4 h-4 text-zinc-405 shrink-0 mt-0.5" />
        <span>
          <strong>Wskazówka:</strong> Płynne podnoszenie suwaka symuluje poziom wilgoci czujnika. Osiągnięcie wartości progowej pow. <strong>60%</strong> wywoła sekwencję alarmową w panelach nadrzędnych.
        </span>
      </div>
    </div>
  );
};
