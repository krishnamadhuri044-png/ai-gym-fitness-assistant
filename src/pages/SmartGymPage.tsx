import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Activity,
  Heart,
  Zap,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Timer,
  Droplets,
  Radio,
  Dumbbell
} from 'lucide-react';
import { IoTEquipmentData } from '../types';
import { api } from '../services/api';

export const SmartGymPage: React.FC = () => {
  const [telemetry, setTelemetry] = useState<IoTEquipmentData>({
    equipmentId: 'eq-legpress-45',
    equipmentName: 'ISO-Lateral Leg Press 45°',
    resistanceKg: 140,
    reps: 8,
    heartRateBpm: 148,
    powerWatts: 385,
    timestamp: new Date().toISOString(),
    recommendations: {
      resistanceAdjustment: 'Increase load by 5-10kg on next set. Concentric velocity is optimal (0.68 m/s).',
      restSeconds: 90,
      intensityVerdict: 'Optimal',
      hydrationReminder: true
    }
  });

  const [isSimulatingStream, setIsSimulatingStream] = useState<boolean>(true);
  const [restTimerSeconds, setRestTimerSeconds] = useState<number>(75);
  const [isRestTimerActive, setIsRestTimerActive] = useState<boolean>(false);

  useEffect(() => {
    api.getIoTEquipment().then((data) => {
      setTelemetry(data);
    }).catch((err) => {
      console.error('Error fetching IoT equipment:', err);
    });
  }, []);

  // Simulating live MQTT / Node-RED incoming sensor packets
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isSimulatingStream) {
      interval = setInterval(() => {
        setTelemetry((prev: IoTEquipmentData) => {
          const deltaBpm = Math.floor(Math.random() * 5) - 2;
          const nextReps = prev.reps < 12 ? prev.reps + 1 : 1;
          const nextWatts = Math.round(340 + Math.random() * 90);
          return {
            ...prev,
            reps: nextReps,
            heartRateBpm: Math.min(175, Math.max(120, prev.heartRateBpm + deltaBpm)),
            powerWatts: nextWatts,
            timestamp: new Date().toISOString()
          };
        });
      }, 2500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulatingStream]);

  // Rest timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRestTimerActive && restTimerSeconds > 0) {
      timer = setInterval(() => {
        setRestTimerSeconds((s) => s - 1);
      }, 1000);
    } else if (restTimerSeconds === 0) {
      setIsRestTimerActive(false);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRestTimerActive, restTimerSeconds]);

  const handleAdjustWeight = async (newWeight: number) => {
    const updatedWeight = Math.max(20, newWeight);
    try {
      const updated = await api.simulateIoTData({ resistanceKg: updatedWeight });
      setTelemetry(updated);
    } catch (err) {
      setTelemetry((prev) => ({ ...prev, resistanceKg: updatedWeight }));
    }
  };

  const handleStartRestTimer = (seconds: number) => {
    setRestTimerSeconds(seconds);
    setIsRestTimerActive(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> MQTT / Node-RED IoT Telemetry
            </span>
            <span className="text-xs text-slate-400">Gym Hardware Sensor Stream</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Smart Gym Assistant &amp; Connected Equipment
          </h1>
          <p className="text-xs text-slate-300">
            Real-time biometric and load-cell sensor telemetry with automatic weight suggestions and recovery timing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSimulatingStream(!isSimulatingStream)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-colors ${
              isSimulatingStream
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isSimulatingStream ? 'animate-pulse text-emerald-400' : ''}`} />
            {isSimulatingStream ? 'IoT Sensor Stream Live' : 'Sensor Stream Paused'}
          </button>
        </div>
      </div>

      {/* Equipment Header Card */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/30 border border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Dumbbell className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-mono text-cyan-400 uppercase font-bold">DEVICE ID: {telemetry.equipmentId}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <h2 className="text-xl font-extrabold text-white">{telemetry.equipmentName}</h2>
            <p className="text-xs text-slate-400">BLE 5.2 / MQTT Sensor Node Connected</p>
          </div>
        </div>

        {/* Load Adjuster */}
        <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl">
          <span className="text-xs font-semibold text-slate-400 pl-2">Adjust Resistance:</span>
          <button
            onClick={() => handleAdjustWeight(telemetry.resistanceKg - 5)}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-750 text-white font-bold flex items-center justify-center"
          >
            -
          </button>
          <span className="font-mono font-bold text-base text-cyan-300 min-w-[50px] text-center">
            {telemetry.resistanceKg} kg
          </span>
          <button
            onClick={() => handleAdjustWeight(telemetry.resistanceKg + 5)}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-750 text-white font-bold flex items-center justify-center"
          >
            +
          </button>
        </div>
      </div>

      {/* 4 Real-time Sensor Meters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Resistance */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>Load Cell Weight</span>
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          </span>
          <div className="text-3xl font-extrabold text-white">
            {telemetry.resistanceKg} <span className="text-sm font-normal text-slate-400">kg</span>
          </div>
          <span className="text-[11px] text-cyan-300 font-mono">Pin 14 / ISO Verified</span>
        </div>

        {/* Reps */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>Hardware Rep Count</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </span>
          <div className="text-3xl font-extrabold text-emerald-400">
            {telemetry.reps} <span className="text-sm font-normal text-slate-400">reps</span>
          </div>
          <span className="text-[11px] text-slate-400">Optical Encoder Sensing</span>
        </div>

        {/* Heart Rate */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>Heart Rate</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
          </span>
          <div className="text-3xl font-extrabold text-rose-400">
            {telemetry.heartRateBpm} <span className="text-sm font-normal text-slate-400">BPM</span>
          </div>
          <span className="text-[11px] text-slate-400">
            {telemetry.heartRateBpm > 150 ? 'Zone 4 (Threshold)' : 'Zone 3 (Aerobic Base)'}
          </span>
        </div>

        {/* Power Watts */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>Peak Power Output</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </span>
          <div className="text-3xl font-extrabold text-amber-400">
            {telemetry.powerWatts} <span className="text-sm font-normal text-slate-400">Watts</span>
          </div>
          <span className="text-[11px] text-slate-400">Concentric Kinetic Energy</span>
        </div>
      </div>

      {/* AI IoT Recommendations & Recovery Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommendation Engine (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Smart Machine Biomechanical Directives</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold">
              Intensity: {telemetry.recommendations.intensityVerdict}
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="text-xs font-semibold text-cyan-400">Adaptive Load Adjustment</span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {telemetry.recommendations.resistanceAdjustment}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="text-xs font-semibold text-rose-400">Cardiovascular Zone Guidance</span>
              <p className="text-xs text-slate-200 leading-relaxed">
                Current heart rate of {telemetry.heartRateBpm} BPM is optimal for ATP recovery during this compound set.
              </p>
            </div>

            {telemetry.recommendations.hydrationReminder && (
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
                <Droplets className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-blue-300">Hydration Warning</span>
                  <p className="text-xs text-slate-300 mt-0.5">High power output detected. Consume 200ml electrolyte water.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rest Interval & Recovery Timer (1 Col) */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Timer className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Set Rest Interval Timer</h3>
            </div>

            <div className="text-center py-6 bg-slate-950/80 rounded-2xl border border-slate-800">
              <span className="text-5xl font-mono font-extrabold text-white tracking-tight">
                {Math.floor(restTimerSeconds / 60)}:{(restTimerSeconds % 60).toString().padStart(2, '0')}
              </span>
              <span className="text-xs text-slate-400 block mt-1">
                {isRestTimerActive ? 'Resting & Clearing Lactic Acid...' : 'Ready for Next Set'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
              <button
                onClick={() => handleStartRestTimer(60)}
                className="py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
              >
                60s (Hypertrophy)
              </button>
              <button
                onClick={() => handleStartRestTimer(90)}
                className="py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
              >
                90s (Standard)
              </button>
              <button
                onClick={() => handleStartRestTimer(180)}
                className="py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
              >
                3m (Power)
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsRestTimerActive(!isRestTimerActive)}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors ${
              isRestTimerActive
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
            }`}
          >
            {isRestTimerActive ? 'Pause Rest Timer' : 'Start Rest Interval'}
          </button>
        </div>
      </div>
    </div>
  );
};
