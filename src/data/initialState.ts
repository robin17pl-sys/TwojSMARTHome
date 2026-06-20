import { CameraDevice, FloodSensorDevice, LightingDevice, SmartLockDevice, AlarmSystem, LogEvent, Room } from '../types';

export const INITIAL_ROOMS: Room[] = [
  { id: 'all', name: 'Cały dom', icon: 'Home' },
  { id: 'salon', name: 'Salon', icon: 'Sofa' },
  { id: 'kuchnia', name: 'Kuchnia', icon: 'ChefHat' },
  { id: 'sypialnia', name: 'Sypialnia', icon: 'Bed' },
  { id: 'przedpokoj', name: 'Przedpokój', icon: 'DoorOpen' },
  { id: 'ogrod', name: 'Ogród', icon: 'Trees' }
];

export const INITIAL_CAMERAS: CameraDevice[] = [
  {
    id: 'cam-1',
    name: 'Kamera Frontowa (Drzwi)',
    location: 'przedpokoj',
    status: 'online',
    isStreaming: true,
    angle: 90,
    infrared: false,
    motionSensitivity: 'medium',
    lastActivity: '1 minutę temu'
  },
  {
    id: 'cam-2',
    name: 'Kamera Ogród (Taras)',
    location: 'ogrod',
    status: 'online',
    isStreaming: false,
    angle: 45,
    infrared: true,
    motionSensitivity: 'high',
    lastActivity: '5 minut temu'
  },
  {
    id: 'cam-3',
    name: 'Kamera Salon',
    location: 'salon',
    status: 'online',
    isStreaming: false,
    angle: 120,
    infrared: false,
    motionSensitivity: 'low',
    lastActivity: 'Wczoraj'
  }
];

export const INITIAL_FLOOD_SENSORS: FloodSensorDevice[] = [
  {
    id: 'flood-1',
    name: 'Czujnik Zmywarka',
    location: 'kuchnia',
    battery: 92,
    status: 'safe',
    moistureLevel: 12,
    lastChecked: 'Teraz'
  },
  {
    id: 'flood-2',
    name: 'Czujnik Pralka',
    location: 'przedpokoj', // let's say laundry is connected to hallway closet
    battery: 78,
    status: 'safe',
    moistureLevel: 5,
    lastChecked: '3 minuty temu'
  },
  {
    id: 'flood-3',
    name: 'Czujnik Główny Zawór',
    location: 'kuchnia',
    battery: 100,
    status: 'safe',
    moistureLevel: 15,
    lastChecked: 'Teraz'
  }
];

export const INITIAL_LIGHTING: LightingDevice[] = [
  {
    id: 'light-1',
    name: 'Główne Sufitowe',
    location: 'salon',
    isOn: true,
    brightness: 80,
    color: '#FFEAA7',
    temperature: 3000,
    activePreset: 'relax'
  },
  {
    id: 'light-2',
    name: 'Klimatyczne LED',
    location: 'salon',
    isOn: true,
    brightness: 40,
    color: '#6c5ce7',
    temperature: 4000,
    activePreset: 'custom'
  },
  {
    id: 'light-3',
    name: 'Pasek nad Blatem',
    location: 'kuchnia',
    isOn: false,
    brightness: 90,
    color: '#ffffff',
    temperature: 5500,
    activePreset: 'focus'
  },
  {
    id: 'light-4',
    name: 'Lampki Nocne',
    location: 'sypialnia',
    isOn: false,
    brightness: 30,
    color: '#ff9f43',
    temperature: 2700,
    activePreset: 'relax'
  },
  {
    id: 'light-5',
    name: 'Girlanda Taras',
    location: 'ogrod',
    isOn: false,
    brightness: 100,
    color: '#F8EFBA',
    temperature: 2400,
    activePreset: 'custom'
  }
];

export const INITIAL_LOCKS: SmartLockDevice[] = [
  {
    id: 'lock-1',
    name: 'Klamka Drzwi Główne',
    location: 'przedpokoj',
    isLocked: true,
    battery: 88,
    autoLockDelay: 30,
    lastUnlockedBy: 'Tomasz (Klucz zbliżeniowy)',
    tempPin: '4295'
  },
  {
    id: 'lock-2',
    name: 'Zamek Taras',
    location: 'ogrod',
    isLocked: true,
    battery: 95,
    autoLockDelay: 60,
    lastUnlockedBy: 'Katarzyna (Aplikacja)',
    tempPin: '1108'
  }
];

export const INITIAL_ALARM: AlarmSystem = {
  mode: 'disarmed',
  isSirenTriggered: false,
  code: '1234',
  smokeDetectorSafe: true,
  coDetectorSafe: true
};

export const INITIAL_LOGS: LogEvent[] = [
  {
    id: 'log-1',
    time: '00:01:05',
    deviceType: 'alarm',
    severity: 'info',
    message: 'System alarmowy gotowy do uzbrojenia'
  },
  {
    id: 'log-2',
    time: '23:45:12',
    deviceType: 'lock',
    severity: 'info',
    message: 'Tomasz otworzył klamkę drzwi głównych'
  },
  {
    id: 'log-3',
    time: '22:15:00',
    deviceType: 'lighting',
    severity: 'info',
    message: 'Oświetlenie ogrodu wyłączone automatycznie harmonogramem'
  },
  {
    id: 'log-4',
    time: '20:11:32',
    deviceType: 'camera',
    severity: 'warning',
    message: 'Kamera Frontowa: wykryto ruch na podjeździe'
  }
];
