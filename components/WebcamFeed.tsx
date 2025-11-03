import React, { useRef, useEffect, useState } from 'react';
import { CameraIcon, AlertTriangleIcon, UserCircleIcon } from './icons/Icons';

interface WebcamFeedProps {
  onStreamReady?: (stream: MediaStream) => void;
  captureTrigger: number;
  onCapture: (dataUrl: string) => void;
}

const DEV_AVATAR_URL = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIiBhcmlhLWhpZGRlbj0idHJ1ZSI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTAuNSA2YTQuNSA0LjUgMCAxMTkgMCA0LjUgNC41IDAgMDEtOSAwek0xOS41IDEyYTUuMjUgNS4yNSAwIDAwLTEwLjUgMHYuMjVjMCAuNTU0LjIzNCAxLjA1My42MjQgMS40MjNsLjQ3My40NzJhLjc1Ljc1IDAgMSAwIDEuMDYtMS4wNmwtLjQ3Mi0uNDcyYTMuNzUgMy43NSAwIDAxLTMuMTg2LTEuMDc4QTMuNzUgMy43NSAwIDAxMTUgMTJjMC0uMTU2LjAyLS4zMDcuMDU5LS40NTZhMy4wMDIgMy4wMDIgMCAwMDUuOTQxLS4wMDJjLjAzOS4xNDkuMDU5LjMwMS4wNTkuNDU4IDAgLjkzNS0uMzQgMS43ODUtLjk0MiAyLjQ2OGE5LjcwMSA5LjcwMSAwIDAwLTEuNDU4IDEuMTRjLS45NzkgMS4wMTQtMS41OTQgMi4zNTMtMS43NjYgMy44NzdhLjc1Ljc1IDAgMDAtLjc1Mi42ODhaTTcuNSA5YTQuNSA0LjUgMCAxMS05IDAgNC41IDQuNSAwIDAxOSAwek0zIDEyYTUuMjUgNS4yNSAwIDAxMTAuNSAwbC0uMDAxLS4yNWEuNzUuNzUgMCAwMC0xLjUtLjAyNVYxMmEzLjc1MyAzLjc1MyAwIDAwLTYuNTM0IDIuNzgyYy4yODMuNjg2LjczNyAxLjI5OCAxLjI5MiAxLjgyYS43NS43NSAwIDAwMS4wNjItMS4wNTljLS41MDItLjQ3Mi0uOTUyLTEuMDItMS4xOTEtMS42NjFBMi4yNSAyLjI1IDAgMDExLjUgMTJjMC0xLjIzOCAxLjAwNy0yLjI1IDIuMjUtMi4yNVM2IDExLjAyOCA2IDkuNzVhMyAzIDAgMDEwLTZjMyAzIDAgMDAtNiAwdi43NDhjLS4wMzYuMTYyLS4wNTQuMzI3LS4wNTQuNDkyek0yMC42NjggMTguMzgxYTcuNSA3LjUgMCAwMC0xMC44MzYgMEEuNzUuNzUgMCAwMC43NS43NSAwIDEwMS4wNDkgMy45NDlDNC4zMSAxLjIzNSA3LjUgMCAxMC44MzMgMGMzLjM0MyAwIDYuNTMyIDEuMjM1IDEuNzg1IDMuOTQ5YS43NS43NSAwIDEwMS4wNS0xLjA0OWwtLjAxLS4wMDhhNy41IDcuNSAwIDAwLTEuNTg5IDIuOTQyYy4yOS4yOS41NjUuNTkyLjgyNi45MDdhNy40OCA3LjQ4IDAgMDEwIDEwLjAzNi43NS43NSAwIDAwLTEuMDQtMS4wNTljLS4yNjEtLjMxNS0uNTM2LS42MTctLjgyNi0uOTA4YTcuNSA3LjUgMCAwMC0yLjY3IDEuOTg1eiIgY2xpcC1ydWxlPSJldmVub2RkIiAvPjwvc3ZnPg==';

const WebcamFeed: React.FC<WebcamFeedProps> = ({ onStreamReady, captureTrigger, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [permissionStatus, setPermissionStatus] = useState<'pending' | 'granted' | 'denied' | 'dev'>('pending');
  
  useEffect(() => {
    let stream: MediaStream | null = null;
    let isCancelled = false;

    const getMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (isCancelled) {
          mediaStream.getTracks().forEach(track => track.stop());
          return;
        }
        stream = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        if (onStreamReady) onStreamReady(stream);
        setPermissionStatus('granted');
      } catch (err) {
        if (!isCancelled) {
          console.warn("Could not access camera, entering dev mode.", err);
          setPermissionStatus('dev');
        }
      }
    };
    getMedia();

    return () => {
      isCancelled = true;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onStreamReady]);
  
  useEffect(() => {
    if (captureTrigger > 0 && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;
      
      canvas.width = 320;
      canvas.height = 240;

      if (permissionStatus === 'granted' && videoRef.current) {
        context.save();
        context.scale(-1, 1);
        context.drawImage(videoRef.current, -canvas.width, 0, canvas.width, canvas.height);
        context.restore();
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(dataUrl);
      } else if (permissionStatus === 'dev') {
        // Draw placeholder for capture
        context.fillStyle = '#1f2937'; // gray-800
        context.fillRect(0, 0, canvas.width, canvas.height);
        const img = new Image();
        img.onload = () => {
          context.drawImage(img, canvas.width / 2 - 50, canvas.height / 2 - 50, 100, 100);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          onCapture(dataUrl);
        };
        img.src = DEV_AVATAR_URL;
      }
    }
  }, [captureTrigger, permissionStatus, onCapture]);

  const renderOverlay = () => {
    switch (permissionStatus) {
      case 'pending':
        return (
          <>
            <CameraIcon className="w-12 h-12 text-indigo-400 animate-pulse" />
            <p className="mt-2 text-white">Requesting camera access...</p>
          </>
        );
      case 'denied':
        return (
          <>
            <AlertTriangleIcon className="w-12 h-12 text-red-500" />
            <p className="mt-2 text-white font-semibold">Camera Access Denied</p>
            <p className="text-xs text-gray-400">Please enable permissions to proceed.</p>
          </>
        );
      case 'dev':
         return (
          <>
            <UserCircleIcon className="w-24 h-24 text-indigo-400" />
            <p className="mt-2 text-white font-semibold">Camera Not Found</p>
            <p className="px-2 py-1 mt-2 bg-yellow-500 text-black text-xs font-bold rounded">DEV MODE</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full aspect-video max-w-sm mx-auto bg-gray-900 rounded-lg overflow-hidden shadow-lg border-2 border-gray-700">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transition-opacity duration-500 ${permissionStatus === 'granted' ? 'opacity-100' : 'opacity-0'}`}
        style={{ transform: 'scaleX(-1)' }}
      />
      <canvas ref={canvasRef} className="hidden" />
      
      {permissionStatus !== 'granted' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-gray-900">
          {renderOverlay()}
        </div>
      )}
      
      <div className="absolute top-2 left-2 flex items-center bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
        <span className="relative flex h-2 w-2 mr-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
        REC
      </div>
    </div>
  );
};

export default WebcamFeed;