import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, RotateCw, Eye, EyeOff, ShieldAlert, Video, RefreshCw, Smartphone } from 'lucide-react';
import { CameraDevice, LogEvent } from '../types';

interface CameraManagerProps {
  cameras: CameraDevice[];
  onUpdateCamera: (updated: CameraDevice) => void;
  onAddLog: (msg: string, deviceType: 'camera', severity: 'info' | 'warning' | 'critical') => void;
}

export const CameraManager: React.FC<CameraManagerProps> = ({ cameras, onUpdateCamera, onAddLog }) => {
  const [selectedCamId, setSelectedCamId] = useState<string>(cameras[0]?.id || '');
  const activeCamera = cameras.find(c => c.id === selectedCamId) || cameras[0];
  const [rotationDegrees, setRotationDegrees] = useState<number>(activeCamera?.angle || 90);
  const [noiseSeed, setNoiseSeed] = useState<number>(0);
  const [snapshotEffect, setSnapshotEffect] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync state when selected camera changes
  useEffect(() => {
    if (activeCamera) {
      setRotationDegrees(activeCamera.angle);
    }
  }, [selectedCamId]);

  // Update original camera state on slider change
  const handleAngleChange = (newVal: number) => {
    setRotationDegrees(newVal);
    if (activeCamera) {
      onUpdateCamera({
        ...activeCamera,
        angle: newVal
      });
    }
  };

  // Generate a dynamic dashboard canvas mockup of real-time camera scanning/noise
  useEffect(() => {
    if (!activeCamera || !activeCamera.isStreaming || activeCamera.status === 'offline') return;

    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let scanY = 0;
    const draw = () => {
      ctx.fillStyle = activeCamera.infrared ? '#0a2310' : '#011627';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid / Tech UI Lines
      ctx.strokeStyle = activeCamera.infrared ? 'rgba(34, 197, 94, 0.2)' : 'rgba(14, 165, 233, 0.2)';
      ctx.lineWidth = 1;
      
      // Vertical grids
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      // Horizontal grids
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw some abstract landscape elements that shift based on rotated Angle!
      const offset = (rotationDegrees - 90) * 1.5;
      ctx.fillStyle = activeCamera.infrared ? '#14532d' : '#1e293b';
      // Simulated floor or furniture
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.8 + Math.sin(offset/10) * 5);
      ctx.lineTo(canvas.width, canvas.height * 0.82 - Math.cos(offset/10) * 5);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Simulated door/window frame
      ctx.strokeStyle = activeCamera.infrared ? '#22c55e font-bold' : '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(canvas.width / 2 - 50 + offset, canvas.height * 0.3, 100, 100);

      // Person overlay when motion detection is on or as simulated movement
      const t = Date.now() / 1500;
      const motionActive = activeCamera.motionSensitivity === 'high' || activeCamera.motionSensitivity === 'medium';
      if (motionActive) {
        const bob = Math.sin(t) * 10;
        ctx.fillStyle = activeCamera.infrared ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.3)';
        ctx.beginPath();
        ctx.arc(canvas.width * 0.3 + offset, canvas.height * 0.5 + bob, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = activeCamera.infrared ? '#22c55e' : '#ef4444';
        ctx.stroke();
        
        ctx.font = '10px monospace';
        ctx.fillStyle = activeCamera.infrared ? '#22c55e' : '#ef4444';
        ctx.fillText('MOTION DETECTED', canvas.width * 0.3 + offset - 45, canvas.height * 0.5 + bob - 21);
      }

      // Live Timestamp
      const now = new Date();
      ctx.font = '11px monospace';
      ctx.fillStyle = activeCamera.infrared ? '#22c55e' : '#38bdf8';
      ctx.fillText(`LIVE: ${now.toLocaleTimeString('pl-PL')} | ${now.toLocaleDateString('pl-PL')}`, 15, canvas.height - 15);
      ctx.fillText(`FOV ANGLE: ${Math.round(rotationDegrees)}°`, 15, 25);

      // Infrared tag
      if (activeCamera.infrared) {
        ctx.fillStyle = '#22c55e';
        ctx.fillText('IR MODE ACTIVE', canvas.width - 110, 25);
      }

      // Scanning line
      scanY = (scanY + 2) % canvas.height;
      ctx.strokeStyle = activeCamera.infrared ? 'rgba(34, 197, 94, 0.3)' : 'rgba(56, 189, 248, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(canvas.width, scanY);
      ctx.stroke();

      // Vignette effect
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.width * 0.4,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.7
      );
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.6)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [activeCamera, rotationDegrees]);

  const toggleStream = () => {
    if (!activeCamera) return;
    const updated = { ...activeCamera, isStreaming: !activeCamera.isStreaming };
    onUpdateCamera(updated);
    onAddLog(
      `Kamera "${activeCamera.name}": strumień ${updated.isStreaming ? 'włączony' : 'wyłączony'}`,
      'camera',
      'info'
    );
  };

  const toggleInfrared = () => {
    if (!activeCamera) return;
    const updated = { ...activeCamera, infrared: !activeCamera.infrared };
    onUpdateCamera(updated);
    onAddLog(
      `Kamera "${activeCamera.name}": podczerwień ${updated.infrared ? 'włączona' : 'wyłączona'}`,
      'camera',
      'info'
    );
  };

  const handleSensitivityChange = (sens: 'low' | 'medium' | 'high') => {
    if (!activeCamera) return;
    const updated = { ...activeCamera, motionSensitivity: sens };
    onUpdateCamera(updated);
    onAddLog(
      `Kamera "${activeCamera.name}": czułość detekcji ruchu zmieniona na ${sens === 'high' ? 'wysoka' : sens === 'medium' ? 'średnia' : 'niska'}`,
      'camera',
      'info'
    );
  };

  const handleTriggerSnapshot = () => {
    setSnapshotEffect(true);
    setTimeout(() => setSnapshotEffect(false), 200);
    onAddLog(`Kamera "${activeCamera.name}": pomyślnie zapisano migawkę obrazu`, 'camera', 'info');
  };

  return (
    <div className="bg-white rounded-3xl border border-zinc-100 shadow-3xs p-6 flex flex-col h-full" id="camera-section-container">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-zinc-50 text-zinc-900 border border-zinc-150 rounded-2xl">
            <Camera className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <h2 className="font-extrabold text-zinc-950 text-base md:text-lg tracking-tight">
              Kamery Monitoringu
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">Podgląd na żywo oraz pełne sterowanie obrotem obiektywu</p>
          </div>
        </div>
        <div className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 text-zinc-800 border border-zinc-150 rounded-xl text-xs font-bold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Wszystkie systemy aktywne
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Camera List Pane */}
        <div className="lg:col-span-4 flex flex-col gap-3 max-h-[460px] overflow-y-auto pr-1">
          {cameras.map(cam => {
            const isSelected = cam.id === selectedCamId;
            return (
              <button
                key={cam.id}
                onClick={() => setSelectedCamId(cam.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-zinc-900 bg-zinc-50/50 shadow-3xs'
                    : 'border-zinc-100 hover:border-zinc-200 bg-white'
                }`}
                id={`cam-select-btn-${cam.id}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg border ${isSelected ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-zinc-50 border-zinc-100 text-zinc-550'}`}>
                      {cam.isStreaming ? <Video className="w-4 h-4" /> : <CameraOff className="w-4 h-4 text-zinc-300" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wide text-zinc-900">{cam.name}</h4>
                      <p className="text-[11px] text-zinc-400 capitalize mt-0.5">Pokój: {cam.location}</p>
                    </div>
                  </div>
                  <span className={`w-2 h-2 rounded-full mt-1.5 ${cam.status === 'online' ? 'bg-emerald-500' : 'bg-zinc-350'}`} />
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-100/50">
                  <span className="font-mono">Detekcja: <strong className="font-bold">{cam.motionSensitivity === 'high' ? 'WYS' : cam.motionSensitivity === 'medium' ? 'ŚR' : 'NIS'}</strong></span>
                  <span className="text-[10px] text-zinc-405 font-mono">{cam.lastActivity}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Video feed pane & Controller details */}
        <div className="lg:col-span-8 flex flex-col justify-between gap-5 bg-zinc-50/30 rounded-2xl p-4 border border-zinc-100">
          {activeCamera ? (
            <>
              {/* Active Cam Feeder screen */}
              <div className="relative w-full aspect-video rounded-xl bg-zinc-950 border border-zinc-900 overflow-hidden shadow-3xs">
                {activeCamera.isStreaming ? (
                  <canvas
                    ref={canvasRef}
                    width={560}
                    height={315}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 gap-3">
                    <CameraOff className="w-10 h-10 text-zinc-705" />
                    <div className="text-center">
                      <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Strumień wideo został zatrzymany</p>
                      <p className="text-[10px] text-zinc-500 mt-1">Naciśnij "Uruchom podgląd" poniżej, aby połączyć się z kamerą</p>
                    </div>
                  </div>
                )}

                {/* Rec visual state indicator */}
                {activeCamera.isStreaming && (
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-zinc-950/80 px-2 py-1 rounded border border-zinc-800 text-[10px] font-mono tracking-widest text-red-500 font-bold uppercase backdrop-blur-3xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-650 animate-ping"></span>
                    REC
                  </div>
                )}

                {/* Camera Name Title overlay */}
                <div className="absolute top-4 right-4 bg-zinc-950/80 border border-zinc-800 backdrop-blur-3xs text-[10px] text-zinc-300 px-2 py-1 rounded font-mono font-bold tracking-wide">
                  {activeCamera.name.toUpperCase()}
                </div>

                {/* Shutter snapshot effect white sheet */}
                {snapshotEffect && (
                  <div className="absolute inset-0 bg-white animate-fade-out pointer-events-none z-20" />
                )}
              </div>

              {/* Angle rotation control slider and advanced switches */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sliders and control buttons */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-bold text-zinc-650 mb-1.5 uppercase tracking-wide">
                      <span className="flex items-center gap-1.5"><RotateCw className="w-3.5 h-3.5 text-zinc-400" /> Kąt obrotu obiektywu</span>
                      <span className="bg-zinc-100 text-zinc-800 font-mono px-2 py-0.5 rounded text-[10px] font-bold">{rotationDegrees}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="180"
                      value={rotationDegrees}
                      onChange={(e) => handleAngleChange(Number(e.target.value))}
                      disabled={!activeCamera.isStreaming}
                      className="w-full h-1 bg-zinc-100 outline-none rounded-lg appearance-none cursor-pointer accent-zinc-900 disabled:opacity-50"
                      id="camera-angle-slider"
                    />
                    <div className="flex justify-between text-[9px] uppercase font-bold text-zinc-400 mt-1 font-mono">
                      <span>0° (Lewo)</span>
                      <span>90° (Środek)</span>
                      <span>180° (Prawo)</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={toggleStream}
                      className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        activeCamera.isStreaming
                          ? 'bg-zinc-100 text-zinc-900 border border-zinc-200 hover:bg-zinc-200'
                          : 'bg-zinc-900 text-white hover:bg-zinc-850 shadow-3xs'
                      }`}
                      id="toggle-stream-btn"
                    >
                      <Video className="w-4 h-4" />
                      {activeCamera.isStreaming ? 'STOP FEED' : 'LIVE VIEW'}
                    </button>

                    <button
                      onClick={handleTriggerSnapshot}
                      disabled={!activeCamera.isStreaming}
                      className="p-2 bg-white hover:bg-zinc-50 text-zinc-700 disabled:opacity-40 rounded-xl border border-zinc-200 transition-colors cursor-pointer"
                      title="Zrób zdjęcie"
                      id="cam-snapshot-btn"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Additional sensor properties toggles */}
                <div className="space-y-3 bg-white p-3.5 rounded-xl border border-zinc-150 shadow-3xs flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-wide flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-zinc-450" /> Podczerwień (IR)
                    </span>
                    <button
                      onClick={toggleInfrared}
                      disabled={!activeCamera.isStreaming}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
                        activeCamera.infrared ? 'bg-zinc-900' : 'bg-zinc-200'
                      }`}
                      id="toggle-ir-btn"
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          activeCamera.infrared ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="pt-2 border-t border-zinc-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Detekcja ruchu</p>
                    <div className="grid grid-cols-3 gap-1">
                      {(['low', 'medium', 'high'] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSensitivityChange(s)}
                          className={`py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer border ${
                            activeCamera.motionSensitivity === s
                              ? 'bg-zinc-900 border-zinc-900 text-white'
                              : 'bg-zinc-50 border-zinc-100/55 hover:bg-zinc-100 text-zinc-600'
                          }`}
                        >
                          {s === 'low' ? 'NIS' : s === 'medium' ? 'ŚR' : 'WYS'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-20 text-zinc-400">
              <Camera className="w-12 h-12 mb-3 stroke-[1.5]" />
              <p className="text-xs">Brak dostępnych kamer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
