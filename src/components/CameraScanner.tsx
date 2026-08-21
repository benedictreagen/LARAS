import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  ArrowLeft,
  Zap,
  ZapOff,
  RefreshCw,
  Layers,
  CheckCircle,
  Crosshair,
  Sparkles,
  SunMedium,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  SwitchCamera,
  HelpCircle,
  Info
} from 'lucide-react';
import { IndicatorPreset, RGBColor } from '../types';
import { SAMPLE_INDICATOR_PRESETS } from '../data/mockData';
import { rgbToHex } from '../utils/colorimetric';

interface CameraScannerProps {
  onCapture: (capturedData: {
    rgb: RGBColor;
    preset?: IndicatorPreset;
    luxLevel: 'Optimal' | 'Cukup' | 'Rendah';
    customImage?: string;
  }) => void;
  onCancel: () => void;
  selectedLocation: string;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  onCapture,
  onCancel,
  selectedLocation,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [flashOn, setFlashOn] = useState<boolean>(false);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [scanMode, setScanMode] = useState<'live' | 'upload' | 'sample'>('live');
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);

  const [liveRgb, setLiveRgb] = useState<RGBColor>({ r: 188, g: 52, b: 74, hex: '#BC344A' });
  const [ambientLux, setAmbientLux] = useState<'Optimal' | 'Cukup' | 'Rendah'>('Optimal');
  const animationFrameRef = useRef<number | null>(null);

  // Initialize camera stream
  const startCamera = async (facing: 'environment' | 'user' = facingMode) => {
    try {
      setCameraError(null);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Kamera tidak didukung pada browser ini.');
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch((e) => {
          console.log('Autoplay handled:', e);
        });
      }
    } catch (err: any) {
      console.warn('Live camera access notice:', err);
      setCameraActive(false);
      setCameraError(
        'Izin kamera belum aktif atau browser dalam mode preview sandbox. Anda dapat menggunakan tombol "Unggah / Foto" atau "Simulasi Kemasan MBG" di bawah.'
      );
    }
  };

  useEffect(() => {
    startCamera(facingMode);

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [facingMode]);

  // Bind video srcObject when videoRef mounts or stream changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    }
  }, [stream, scanMode]);

  // Real-time canvas color extraction loop for live video
  useEffect(() => {
    if (!cameraActive || scanMode !== 'live') return;

    const sampleCenterPixel = () => {
      if (videoRef.current && canvasRef.current && videoRef.current.readyState >= 2) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Central ROI sample
          const centerX = Math.floor(canvas.width / 2);
          const centerY = Math.floor(canvas.height / 2);
          const roiSize = 40;
          const startX = Math.max(0, centerX - roiSize / 2);
          const startY = Math.max(0, centerY - roiSize / 2);

          try {
            const imgData = ctx.getImageData(startX, startY, roiSize, roiSize);
            const data = imgData.data;
            let sumR = 0, sumG = 0, sumB = 0;
            const count = data.length / 4;

            for (let i = 0; i < data.length; i += 4) {
              sumR += data[i];
              sumG += data[i + 1];
              sumB += data[i + 2];
            }

            const avgR = Math.round(sumR / count);
            const avgG = Math.round(sumG / count);
            const avgB = Math.round(sumB / count);

            const brightness = (avgR * 299 + avgG * 587 + avgB * 114) / 1000;
            if (brightness > 110) setAmbientLux('Optimal');
            else if (brightness > 55) setAmbientLux('Cukup');
            else setAmbientLux('Rendah');

            setLiveRgb({
              r: avgR,
              g: avgG,
              b: avgB,
              hex: rgbToHex(avgR, avgG, avgB),
            });
          } catch (e) {
            // safe ignore
          }
        }
      }
      animationFrameRef.current = requestAnimationFrame(sampleCenterPixel);
    };

    animationFrameRef.current = requestAnimationFrame(sampleCenterPixel);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [cameraActive, scanMode]);

  // Handle uploaded image color sampling
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        setUploadedImageSrc(src);
        setScanMode('upload');

        const img = new Image();
        img.onload = () => {
          if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (ctx) {
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0);

              const centerX = Math.floor(canvas.width / 2);
              const centerY = Math.floor(canvas.height / 2);
              const roiSize = Math.min(60, canvas.width / 4);
              const startX = Math.max(0, centerX - roiSize / 2);
              const startY = Math.max(0, centerY - roiSize / 2);

              try {
                const imgData = ctx.getImageData(startX, startY, roiSize, roiSize);
                const data = imgData.data;
                let sumR = 0, sumG = 0, sumB = 0;
                const count = data.length / 4;

                for (let i = 0; i < data.length; i += 4) {
                  sumR += data[i];
                  sumG += data[i + 1];
                  sumB += data[i + 2];
                }

                const avgR = Math.round(sumR / count);
                const avgG = Math.round(sumG / count);
                const avgB = Math.round(sumB / count);

                setLiveRgb({
                  r: avgR,
                  g: avgG,
                  b: avgB,
                  hex: rgbToHex(avgR, avgG, avgB),
                });
              } catch (err) {
                console.warn(err);
              }
            }
          }
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    }
  };

  // Switch camera front/back
  const toggleCameraFacing = () => {
    const newFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newFacing);
    startCamera(newFacing);
  };

  // Flash / Torch Toggle
  const toggleFlash = async () => {
    if (stream) {
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities?.() as any;
      if (capabilities && capabilities.torch) {
        try {
          await track.applyConstraints({
            advanced: [{ torch: !flashOn } as any],
          });
          setFlashOn(!flashOn);
          return;
        } catch (e) {
          console.warn('Torch constraint error:', e);
        }
      }
    }
    setFlashOn(!flashOn);
  };

  const handleCapture = () => {
    if (scanMode === 'sample') {
      const preset = SAMPLE_INDICATOR_PRESETS[selectedPresetIndex];
      onCapture({
        rgb: preset.rgb,
        preset: preset,
        luxLevel: ambientLux,
      });
    } else {
      onCapture({
        rgb: liveRgb,
        preset: undefined,
        luxLevel: ambientLux,
        customImage: uploadedImageSrc || undefined,
      });
    }
  };

  const currentPreset = SAMPLE_INDICATOR_PRESETS[selectedPresetIndex];

  return (
    <div className="relative h-[640px] max-h-[85vh] bg-slate-950 text-white flex flex-col justify-between overflow-hidden rounded-2xl select-none">
      {/* Hidden processing canvas & file input */}
      <canvas ref={canvasRef} className="hidden" />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* TOP BAR / CAMERA CONTROLS */}
      <div className="relative z-20 px-4 pt-3 pb-2 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between">
        <button
          onClick={onCancel}
          className="p-2 rounded-full bg-black/50 text-white/90 hover:bg-black/70 backdrop-blur-md transition-colors"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-xs font-bold tracking-wider uppercase text-rose-200">
            Laras Scanner
          </span>
          <span className="text-[10px] text-white/80 font-medium truncate max-w-[170px]">
            {selectedLocation}
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          {cameraActive && (
            <button
              onClick={toggleCameraFacing}
              className="p-2 rounded-full bg-black/50 text-white/90 hover:bg-black/70 backdrop-blur-md transition-colors"
              title="Ganti Kamera Depan/Belakang"
            >
              <SwitchCamera className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={toggleFlash}
            className={`p-2 rounded-full backdrop-blur-md transition-colors ${
              flashOn
                ? 'bg-amber-400 text-slate-900 shadow-md shadow-amber-400/30'
                : 'bg-black/50 text-white/90 hover:bg-black/70'
            }`}
            title="Penerangan / Flash"
          >
            {flashOn ? <Zap className="w-4 h-4 fill-current" /> : <ZapOff className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* SCAN MODE TABS SELECTOR ON TOP */}
      <div className="relative z-20 px-4 pt-1 pb-1 flex items-center justify-center">
        <div className="flex items-center bg-black/70 backdrop-blur-md p-1 rounded-xl border border-white/15 text-[11px] w-full max-w-xs">
          <button
            onClick={() => {
              setScanMode('live');
              if (!cameraActive) startCamera();
            }}
            className={`flex-1 py-1 px-2 rounded-lg font-semibold transition-all text-center ${
              scanMode === 'live'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-white/70 hover:text-white'
            }`}
          >
            📹 Kamera Live
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 py-1 px-2 rounded-lg font-semibold transition-all text-center ${
              scanMode === 'upload'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-white/70 hover:text-white'
            }`}
          >
            📁 Unggah Foto
          </button>
          <button
            onClick={() => setScanMode('sample')}
            className={`flex-1 py-1 px-2 rounded-lg font-semibold transition-all text-center ${
              scanMode === 'sample'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-white/70 hover:text-white'
            }`}
          >
            🍱 Simulasi MBG
          </button>
        </div>
      </div>

      {/* MAIN VIEWPORT: CAMERA VIDEO / UPLOADED PHOTO / HIGH-FIDELITY PACKAGING SIMULATION */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {/* 1. Live Camera Video */}
        {scanMode === 'live' && (
          <>
            {cameraActive ? (
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className="absolute inset-0 w-full h-full object-cover"
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    videoRef.current.play().catch(() => {});
                  }
                }}
              />
            ) : (
              /* Camera Inactive / Permission Prompt Helper View */
              <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <Camera className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Pratinjau Kamera Belum Terhubung</h4>
                  <p className="text-[11px] text-slate-300 mt-1 max-w-[260px] leading-relaxed">
                    Browser Anda memerlukan izin akses kamera, atau Anda dapat menggunakan tombol <strong>Unggah Foto</strong> / <strong>Simulasi MBG</strong>.
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-full max-w-[240px]">
                  <button
                    onClick={() => startCamera(facingMode)}
                    className="py-2 px-3 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Aktifkan / Coba Lagi Kamera</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 border border-slate-700"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Ambil / Unggah Foto Label</span>
                  </button>
                  <button
                    onClick={() => setScanMode('sample')}
                    className="py-1.5 px-3 rounded-xl text-rose-300 hover:text-white text-xs font-semibold"
                  >
                    Buka Mode Simulasi Kemasan MBG →
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* 2. Uploaded Custom Photo Mode */}
        {scanMode === 'upload' && uploadedImageSrc && (
          <div className="absolute inset-0 bg-slate-950 flex items-center justify-center">
            <img
              src={uploadedImageSrc}
              alt="Uploaded Food Label"
              className="w-full h-full object-contain"
            />
            <div className="absolute top-2 right-2 z-20">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg bg-black/70 text-white text-[10px] font-semibold border border-white/20 hover:bg-black/90 flex items-center gap-1"
              >
                <Upload className="w-3 h-3" />
                <span>Ganti Foto</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. High-Fidelity MBG Food Packaging Simulator */}
        {scanMode === 'sample' && (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col items-center justify-center p-4 text-center">
            <div className="w-full max-w-[290px] bg-slate-800/95 rounded-2xl p-4 border border-slate-700 shadow-2xl relative">
              {/* Packaging Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-700 mb-3 text-left">
                <div>
                  <div className="text-[10px] text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                    <span>Kemasan Pangan MBG</span>
                  </div>
                  <div className="text-xs font-bold text-white truncate max-w-[170px]">
                    {currentPreset.menuItem}
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  {currentPreset.batchId}
                </span>
              </div>

              {/* Simulated Food Container Graphic */}
              <div className="relative w-full h-40 bg-slate-950 rounded-xl flex items-center justify-center overflow-hidden border border-slate-800">
                {/* Texture */}
                <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:10px_10px]" />
                <div className="absolute top-2 left-2 text-[9px] text-slate-500 font-mono">
                  HEADSPACE LAYER (SENSOR ROSALIA)
                </div>

                {/* THE ROSALIA ANTHOCYANIN INDICATOR LABEL ON PACKAGING */}
                <div className="relative flex flex-col items-center justify-center z-10">
                  <div className="text-[9px] text-slate-300 font-semibold mb-1">
                    Label Indikator Mutu (Rosela)
                  </div>
                  <div
                    className="w-18 h-18 rounded-full shadow-2xl border-3 border-white/90 flex items-center justify-center transition-all duration-300 relative ring-4 ring-black/30"
                    style={{ backgroundColor: currentPreset.rgb.hex }}
                  >
                    <div className="w-7 h-7 rounded-full bg-white/20 border border-white/50 animate-ping opacity-25" />
                    <div className="w-9 h-9 rounded-full border border-white/60 flex items-center justify-center bg-black/20">
                      <span className="text-[8px] font-extrabold text-white tracking-wider drop-shadow-sm">
                        LARAS
                      </span>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono font-medium text-slate-200 mt-1.5 bg-black/60 px-2.5 py-0.5 rounded-full border border-white/10">
                    {currentPreset.sensoryVisual}
                  </div>
                </div>
              </div>

              <div className="mt-2.5 text-[10px] text-slate-400 text-left flex items-center justify-between">
                <span>Fase: <strong className="text-white">{currentPreset.stageName}</strong></span>
                <span className="font-mono text-rose-300 font-bold">
                  RGB {currentPreset.rgb.r}|{currentPreset.rgb.g}|{currentPreset.rgb.b}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Flash Effect */}
        {flashOn && (
          <div className="absolute inset-0 bg-white/25 pointer-events-none transition-opacity duration-300 z-10" />
        )}

        {/* SCANNING RETICLE / FRAME OVERLAY */}
        <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
          <div className="relative w-52 h-52 rounded-2xl border border-white/30 flex items-center justify-center shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]">
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-rose-500 rounded-tl-lg" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-rose-500 rounded-tr-lg" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-rose-500 rounded-bl-lg" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-rose-500 rounded-br-lg" />

            <div className="w-12 h-12 rounded-full border border-rose-400/60 flex items-center justify-center">
              <Crosshair className="w-6 h-6 text-rose-400/90 stroke-[1.5px]" />
            </div>

            {/* Sweep Laser Animation */}
            <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_8px_#f43f5e] animate-laser-sweep pointer-events-none" />

            {/* Color Swatch Badge Under Reticle */}
            <div className="absolute -bottom-10 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center space-x-2 text-[11px] font-mono text-white pointer-events-auto">
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/60 flex-shrink-0 shadow-xs"
                style={{
                  backgroundColor:
                    scanMode === 'sample' ? currentPreset.rgb.hex : liveRgb.hex,
                }}
              />
              <span className="font-bold">
                RGB:{' '}
                {scanMode === 'sample'
                  ? `${currentPreset.rgb.r}, ${currentPreset.rgb.g}, ${currentPreset.rgb.b}`
                  : `${liveRgb.r}, ${liveRgb.g}, ${liveRgb.b}`}
              </span>
            </div>
          </div>
        </div>

        {/* Ambient Lux & Calibration Badge on Top-Left */}
        <div className="absolute top-2 left-4 z-20 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15 text-[10px] text-white/90 flex items-center gap-1.5">
          <SunMedium className="w-3.5 h-3.5 text-amber-300" />
          <span>Lux: <strong>{ambientLux}</strong></span>
          <span className="text-white/40">|</span>
          <span className="text-emerald-400 font-semibold">Kalibrasi Aktif</span>
        </div>
      </div>

      {/* SAMPLE PRESETS CAROUSEL (When in sample mode) */}
      {scanMode === 'sample' && (
        <div className="relative z-20 px-4 py-2 bg-black/80 backdrop-blur-md border-t border-white/10">
          <div className="text-[10px] text-slate-300 font-semibold mb-1.5 flex items-center justify-between">
            <span>Kondisi Sampel Kemasan MBG:</span>
            <span className="text-rose-400 font-mono text-[9px]">Uji Coba Validasi</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {SAMPLE_INDICATOR_PRESETS.map((preset, idx) => (
              <button
                key={preset.id}
                onClick={() => setSelectedPresetIndex(idx)}
                className={`flex-shrink-0 flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-left text-xs transition-all ${
                  selectedPresetIndex === idx
                    ? 'bg-rose-900/90 border border-rose-400 text-white shadow-sm'
                    : 'bg-white/10 border border-white/10 text-white/70 hover:bg-white/15'
                }`}
              >
                <div
                  className="w-3.5 h-3.5 rounded-full border border-white/40 flex-shrink-0"
                  style={{ backgroundColor: preset.rgb.hex }}
                />
                <div className="min-w-0">
                  <div className="font-bold text-[10px] leading-tight truncate max-w-[120px]">
                    {preset.expectedStatus}
                  </div>
                  <div className="text-[9px] text-white/70 truncate max-w-[120px]">
                    {preset.sensoryVisual}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* BOTTOM SHUTTER & ACTION BUTTON */}
      <div className="relative z-20 px-4 pt-2.5 pb-4 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col items-center">
        <div className="text-center mb-2.5">
          <p className="text-xs font-semibold text-white tracking-wide">
            {scanMode === 'live'
              ? 'Arahkan kamera ke label indikator rosela'
              : scanMode === 'upload'
              ? 'Foto label kemasan siap dianalisis'
              : 'Pilih sampel kemasan lalu tekan tombol scan'}
          </p>
          <p className="text-[10px] text-white/60 mt-0.5">
            Ekstraksi nilai RGB dan klasifikasi mutu pangan otomatis
          </p>
        </div>

        {/* Big Shutter / Scan Button */}
        <div className="flex items-center justify-center w-full gap-4">
          <button
            onClick={handleCapture}
            className="group relative w-16 h-16 rounded-full p-1 bg-white/20 border-2 border-white/80 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-xl"
            aria-label="Ambil gambar dan analisis warna"
          >
            <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-rose-800 via-rose-600 to-rose-500 group-hover:from-rose-700 group-hover:to-rose-400 flex items-center justify-center text-white shadow-lg shadow-rose-900/50">
              <Camera className="w-7 h-7 stroke-[2.2px]" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
