import React from 'react';
import { Lightbulb, Sun, Palette, Zap, Check, HelpCircle } from 'lucide-react';
import { LightingDevice } from '../types';

interface LightingManagerProps {
  lights: LightingDevice[];
  onUpdateLight: (updated: LightingDevice) => void;
  onAddLog: (msg: string, deviceType: 'lighting', severity: 'info' | 'warning' | 'critical') => void;
}

export const LightingManager: React.FC<LightingManagerProps> = ({ lights, onUpdateLight, onAddLog }) => {
  const togglePower = (light: LightingDevice) => {
    const updated = { ...light, isOn: !light.isOn };
    onUpdateLight(updated);
    onAddLog(
      `Oświetlenie "${light.name}": ${updated.isOn ? 'Włączone' : 'Wyłączone'}`,
      'lighting',
      'info'
    );
  };

  const handleBrightnessChange = (light: LightingDevice, val: number) => {
    const updated = { ...light, brightness: val, isOn: val > 0 ? true : light.isOn };
    onUpdateLight(updated);
  };

  const handleColorChange = (light: LightingDevice, color: string) => {
    const updated = { ...light, color, activePreset: 'custom' as const };
    onUpdateLight(updated);
    // Don't overwhelm the logs with color dragging, just log on change if desired.
  };

  const handlePresetSelect = (light: LightingDevice, preset: 'relax' | 'focus' | 'party') => {
    let brightness = light.brightness;
    let color = light.color;
    let temperature = light.temperature;

    if (preset === 'relax') {
      brightness = 35;
      color = '#ff9f43'; // Warm Sunset Orange
      temperature = 2700;
    } else if (preset === 'focus') {
      brightness = 90;
      color = '#ffffff'; // Bright Clean White
      temperature = 6000;
    } else if (preset === 'party') {
      brightness = 100;
      color = '#e84393'; // Magenta Pinwheel
      temperature = 4000;
    }

    const updated: LightingDevice = {
      ...light,
      isOn: true,
      brightness,
      color,
      temperature,
      activePreset: preset
    };

    onUpdateLight(updated);
    onAddLog(
      `Oświetlenie "${light.name}": aktywowano tryb "${preset === 'relax' ? 'Relaks' : preset === 'focus' ? 'Skupienie' : 'Impreza'}"`,
      'lighting',
      'info'
    );
  };

  // Predefined gorgeous colors for simple selection
  const GORGEOUS_COLORS = [
    { name: 'Warm Warm', value: '#FFEAA7' },
    { name: 'Neutral Bath', value: '#ffffff' },
    { name: 'Sunset Glow', value: '#ff9f43' },
    { name: 'Cozy Rose', value: '#ff7675' },
    { name: 'Mint Soft', value: '#55efc4' },
    { name: 'Sky Ambient', value: '#74b9ff' },
    { name: 'Cyber Indigo', value: '#a29bfe' },
    { name: 'Neon Pink', value: '#fd79a8' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-zinc-100 shadow-3xs p-6 flex flex-col h-full" id="lighting-section-container">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-zinc-50 text-zinc-900 border border-zinc-150 rounded-2xl">
            <Lightbulb className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <h2 className="font-extrabold text-zinc-950 text-base md:text-lg tracking-tight">
              Oświetlenie Smart
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">Kontrola jasności, kolorów, temperatury barwowej oraz scen oświetleniowych</p>
          </div>
        </div>
        
        {/* Count of lights active */}
        <div className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 bg-zinc-905 text-white rounded-xl text-xs font-bold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" />
          Aktywne obwody: {lights.filter(l => l.isOn).length} z {lights.length}
        </div>
      </div>

      {/* Grid of lighting devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 flex-1">
        {lights.map(light => {
          // Custom color glow effect based on bulb color if on
          const glowingShadow = light.isOn
            ? { boxShadow: `0 10px 25px -5px ${light.color}15, 0 8px 10px -6px ${light.color}10` }
            : {};

          return (
            <div
              key={light.id}
              style={glowingShadow}
              className={`rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                light.isOn
                  ? 'border-zinc-200 bg-white ring-2 ring-zinc-50'
                  : 'border-zinc-100 hover:border-zinc-150 bg-zinc-50/20'
              }`}
              id={`light-card-${light.id}`}
            >
              {/* Card Header details */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="p-3 rounded-2xl transition-all duration-300 relative border border-zinc-100"
                    style={{
                      backgroundColor: light.isOn ? `${light.color}10` : '#f4f4f5',
                      color: light.isOn ? light.color : '#71717a'
                    }}
                  >
                    <Lightbulb className="w-5 h-5 stroke-[1.75]" />
                    {light.isOn && (
                      <span
                        className="absolute inset-0 rounded-2xl animate-ping opacity-15 pointer-events-none"
                        style={{ backgroundColor: light.color }}
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wide text-zinc-900 leading-snug">{light.name}</h4>
                    <p className="text-[11px] text-zinc-400 capitalize mt-0.5">Pokój: {light.location}</p>
                  </div>
                </div>

                {/* Power toggle on click slider button */}
                <button
                  onClick={() => togglePower(light)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${
                    light.isOn ? 'bg-zinc-900' : 'bg-zinc-200'
                  }`}
                  id={`light-power-toggle-${light.id}`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow-sm ${
                      light.isOn ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Slider Controls for active lighting */}
              <div className={`space-y-4 ${light.isOn ? 'opacity-100' : 'opacity-40 select-none pointer-events-none'}`}>
                {/* Brightness bar */}
                <div>
                  <div className="flex justify-between items-center text-[11px] text-zinc-500 mb-1">
                    <span className="flex items-center gap-1"><Sun className="w-3.5 h-3.5 text-zinc-400" /> Jasność</span>
                    <span className="font-bold font-mono">{light.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={light.brightness}
                    onChange={(e) => handleBrightnessChange(light, Number(e.target.value))}
                    className="w-full h-1 bg-zinc-100 outline-none rounded-lg appearance-none cursor-pointer accent-zinc-900"
                    id={`light-bright-slider-${light.id}`}
                  />
                </div>

                {/* Color swatches */}
                <div>
                  <span className="text-[11px] text-zinc-500 flex items-center gap-1 mb-1.5"><Palette className="w-3.5 h-3.5 text-zinc-400" /> Kolor światła RGB</span>
                  <div className="flex flex-wrap gap-1.5">
                    {/* Native color picker */}
                    <div className="relative w-7 h-7 rounded-lg border border-zinc-200 overflow-hidden cursor-pointer hover:scale-105 transition-all">
                      <input
                        type="color"
                        value={light.color}
                        onChange={(e) => handleColorChange(light, e.target.value)}
                        className="absolute inset--2 w-[150%] h-[150%] border-0 cursor-pointer p-0"
                      />
                    </div>
                    {/* Preselected designer color swatches */}
                    {GORGEOUS_COLORS.map(c => (
                      <button
                        key={c.value}
                        onClick={() => handleColorChange(light, c.value)}
                        className="w-7 h-7 rounded-lg border border-zinc-150 hover:scale-105 transition-transform cursor-pointer relative flex items-center justify-center font-bold"
                        style={{ backgroundColor: c.value }}
                        title={c.name}
                      >
                        {light.color.toLowerCase() === c.value.toLowerCase() && (
                          <Check className={`w-3.5 h-3.5 ${c.value === '#ffffff' ? 'text-zinc-900' : 'text-white'} drop-shadow-sm`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scene Mode selector */}
                <div>
                  <span className="text-[11px] text-zinc-500 block mb-1.5">Błyskawiczne sceny barwne</span>
                  <div className="grid grid-cols-3 gap-1">
                    {(['relax', 'focus', 'party'] as const).map(preset => (
                      <button
                        key={preset}
                        onClick={() => handlePresetSelect(light, preset)}
                        className={`py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer border ${
                          light.activePreset === preset
                            ? 'bg-zinc-900 text-white border-zinc-900'
                            : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-650 border-zinc-100'
                        }`}
                      >
                        {preset === 'relax' ? 'Relaks' : preset === 'focus' ? 'Skupienie' : 'Impreza'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {!light.isOn && (
                <div className="text-center py-6 text-zinc-400 text-xs italic">
                  Odbiornik wyłączony
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Helper note */}
      <div className="mt-4 p-3 bg-zinc-50/50 rounded-2xl border border-zinc-100 text-zinc-500 text-xs flex gap-2 items-start leading-relaxed shadow-3xs">
        <HelpCircle className="w-4 h-4 text-zinc-405 shrink-0 mt-0.5" />
        <span>
          <strong>Glow FX:</strong> Interfejs automatycznie rysuje miękką poświatę światła wokół aktywnych kart oświetlenia zgodną z wybranym kolorem RGB. Wybierz np. błękitny lub neonowy róż, aby zobaczyć efekt aureoli na żywo!
        </span>
      </div>
    </div>
  );
};
