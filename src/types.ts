export type DeviceType = 'camera' | 'flood' | 'lighting' | 'lock' | 'alarm';

export interface CameraDevice {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline';
  isStreaming: boolean;
  angle: number; // 0 to 180 degrees
  infrared: boolean;
  motionSensitivity: 'low' | 'medium' | 'high';
  lastActivity: string;
}

export interface FloodSensorDevice {
  id: string;
  name: string;
  location: string;
  battery: number;
  status: 'safe' | 'leak';
  moistureLevel: number; // 0 to 100%
  lastChecked: string;
}

export interface LightingDevice {
  id: string;
  name: string;
  location: string;
  isOn: boolean;
  brightness: number; // 0 to 100
  color: string; // Hex code
  temperature: number; // 2700 to 6500 Kelvin
  activePreset: 'custom' | 'relax' | 'focus' | 'party';
}

export interface SmartLockDevice {
  id: string;
  name: string;
  location: string;
  isLocked: boolean;
  battery: number;
  autoLockDelay: number; // seconds
  lastUnlockedBy?: string;
  tempPin: string;
}

export interface AlarmSystem {
  mode: 'disarmed' | 'armed_stay' | 'armed_away';
  isSirenTriggered: boolean;
  code: string;
  smokeDetectorSafe: boolean;
  coDetectorSafe: boolean;
}

export interface LogEvent {
  id: string;
  time: string;
  deviceType: DeviceType;
  severity: 'info' | 'warning' | 'critical';
  message: string;
}

export interface Room {
  id: string;
  name: string;
  icon: string;
}
