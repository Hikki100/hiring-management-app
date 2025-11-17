"use client";

import { useRef, useState, useEffect } from "react";
import { Camera, RefreshCw, Check, X, Hand } from "lucide-react";

export default function WebcamCapture({ onPhotoCapture, required = false }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [fingerCount, setFingerCount] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Start webcam
  const startWebcam = async () => {
    try {
      setError("");
      setIsVideoReady(false);

      console.log("🎥 Requesting webcam access...");

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true, // Simplified - let browser decide
      });

      console.log("✅ Webcam access granted");

      if (videoRef.current) {
        console.log("📹 Setting video source...");
        videoRef.current.srcObject = mediaStream;

        // FORCE PLAY immediately
        try {
          console.log("▶️ Attempting to play video...");
          await videoRef.current.play();
          console.log("✅ Video playing!");

          // Wait a bit then check if video is ready
          setTimeout(() => {
            if (videoRef.current) {
              console.log(
                "📐 Video dimensions:",
                videoRef.current.videoWidth,
                "x",
                videoRef.current.videoHeight
              );

              if (videoRef.current.videoWidth > 0) {
                console.log("✅ Video ready for capture");
                setIsVideoReady(true);
              } else {
                console.log("⚠️ Video dimensions still 0, trying again...");
                // Try again after another second
                setTimeout(() => {
                  console.log(
                    "📐 Retry - Video dimensions:",
                    videoRef.current.videoWidth,
                    "x",
                    videoRef.current.videoHeight
                  );
                  setIsVideoReady(true); // Force ready anyway
                }, 1000);
              }
            }
          }, 1000);
        } catch (playErr) {
          console.error("❌ Error playing video:", playErr);
          setError("Gagal memutar video: " + playErr.message);
        }
      }

      setStream(mediaStream);
      setIsWebcamActive(true);
    } catch (err) {
      console.error("❌ Error accessing webcam:", err);
      if (err.name === "NotAllowedError") {
        setError(
          "Izin kamera ditolak. Klik ikon kamera di address bar untuk mengizinkan."
        );
      } else if (err.name === "NotFoundError") {
        setError("Webcam tidak ditemukan. Pastikan perangkat memiliki kamera.");
      } else {
        setError("Tidak dapat mengakses webcam: " + err.message);
      }
    }
  };

  // Stop webcam
  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsWebcamActive(false);
      setIsVideoReady(false);
    }
  };

  // Capture photo
  const capturePhoto = () => {
    console.log("🎥 Attempting to capture photo...");

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video) {
      console.error("❌ Video ref not found");
      setError("Video tidak ditemukan");
      return;
    }

    if (!canvas) {
      console.error("❌ Canvas ref not found");
      setError("Canvas tidak ditemukan");
      return;
    }

    // Check video ready state
    console.log("Video ready state:", video.readyState);
    console.log("Video dimensions:", video.videoWidth, "x", video.videoHeight);

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error("❌ Video dimensions are 0");
      setError("Video belum siap. Tunggu beberapa detik lagi.");
      return;
    }

    try {
      const context = canvas.getContext("2d");

      // Set canvas size sama dengan video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      console.log("Canvas size set to:", canvas.width, "x", canvas.height);

      // Draw video frame ke canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to base64
      const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9);

      console.log("Image data length:", imageDataUrl.length);

      // Check if image is valid (not blank)
      if (imageDataUrl && imageDataUrl.length > 1000) {
        console.log("✅ Photo captured successfully!");
        setCapturedImage(imageDataUrl);

        if (onPhotoCapture) {
          onPhotoCapture(imageDataUrl);
        }

        stopWebcam();
        setCountdown(0);
        setError("");
      } else {
        console.error("❌ Image data too short");
        setError("Gagal mengambil foto. Coba lagi.");
      }
    } catch (err) {
      console.error("❌ Error during capture:", err);
      setError("Terjadi kesalahan saat mengambil foto: " + err.message);
    }
  };

  // Manual capture dengan validation
  const manualCapture = () => {
    if (!isVideoReady) {
      setError("Tunggu video siap dulu...");
      return;
    }

    const video = videoRef.current;
    if (!video || video.videoWidth === 0) {
      setError("Video belum siap. Tunggu beberapa detik.");
      return;
    }

    capturePhoto();
  };

  // Retake photo
  const retakePhoto = () => {
    setCapturedImage(null);
    if (onPhotoCapture) {
      onPhotoCapture(null);
    }
    startWebcam();
  };

  // Simulate finger detection with keyboard
  useEffect(() => {
    if (!isWebcamActive || !isVideoReady) return;

    const handleKeyPress = (e) => {
      if (["1", "2", "3"].includes(e.key)) {
        const fingers = parseInt(e.key);
        setFingerCount(fingers);

        // Auto countdown when 3 fingers
        if (fingers === 3 && countdown === 0) {
          setCountdown(3);
        }
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [isWebcamActive, isVideoReady, countdown]);

  // Countdown effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        if (countdown === 1) {
          capturePhoto();
        }
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Preview or Webcam */}
      <div
        className="relative bg-gray-900 rounded-lg overflow-hidden"
        style={{ aspectRatio: "16/9" }}
      >
        {capturedImage ? (
          // Show captured image
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-cover"
          />
        ) : isWebcamActive ? (
          // Show webcam feed
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Loading indicator */}
            {!isVideoReady && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white mx-auto mb-3"></div>
                  <p>Loading webcam...</p>
                </div>
              </div>
            )}

            {/* Finger count indicator */}
            {isVideoReady && (
              <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <Hand className="w-5 h-5" />
                <span className="font-semibold">
                  {fingerCount === 0
                    ? "Tekan 1, 2, atau 3"
                    : `${fingerCount} jari`}
                </span>
              </div>
            )}

            {/* Countdown overlay */}
            {countdown > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-8xl font-bold animate-pulse">
                  {countdown}
                </div>
              </div>
            )}

            {/* Instructions */}
            {isVideoReady && (
              <div className="absolute bottom-4 left-4 right-4 bg-blue-600/90 text-white px-4 py-3 rounded-lg text-sm">
                <p className="font-semibold mb-1">🎯 Cara Menggunakan:</p>
                <p className="mb-1">
                  Tekan angka <strong>1</strong>, lalu <strong>2</strong>, lalu{" "}
                  <strong>3</strong> di keyboard
                </p>
                <p className="text-xs opacity-90">
                  Foto akan otomatis diambil setelah angka 3!
                </p>
              </div>
            )}
          </div>
        ) : (
          // Show placeholder
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 py-20">
            <Camera className="w-16 h-16 mb-4" />
            <p className="text-lg font-medium">Webcam Belum Aktif</p>
            <p className="text-sm">Klik tombol di bawah untuk memulai</p>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
          <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        {!capturedImage ? (
          <>
            {!isWebcamActive ? (
              <button
                type="button"
                onClick={startWebcam}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Aktifkan Webcam
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={manualCapture}
                  disabled={!isVideoReady}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Camera className="w-5 h-5" />
                  {isVideoReady ? "Ambil Foto Manual" : "Tunggu..."}
                </button>
                <button
                  type="button"
                  onClick={stopWebcam}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Batal
                </button>
              </>
            )}
          </>
        ) : (
          <div className="flex gap-3 w-full">
            <button
              type="button"
              onClick={retakePhoto}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Ambil Ulang
            </button>
            <button
              type="button"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Gunakan Foto Ini
            </button>
          </div>
        )}
      </div>

      {/* Help text */}
      {!capturedImage && (
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <p className="font-medium mb-1">💡 Tips:</p>
          <ul className="space-y-1 text-xs">
            <li>• Pastikan pencahayaan cukup terang</li>
            <li>• Wajah harus terlihat jelas di kamera</li>
            <li>• Tekan angka 1-2-3 berturut-turut untuk auto capture</li>
            <li>• Atau gunakan tombol "Ambil Foto Manual"</li>
          </ul>
        </div>
      )}
    </div>
  );
}
