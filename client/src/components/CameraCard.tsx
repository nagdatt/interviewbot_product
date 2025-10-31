// In CameraCard.tsx - Update to make internal components responsive
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, VideoOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function CameraCard({ className = "" }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setIsActive(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <Card className={`overflow-hidden backdrop-blur-md bg-card/70 border-card-border flex flex-col ${className}`}>
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="text-lg">Camera Feed</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
        <div className="flex-1 min-h-0 p-4 pb-2">
          <div className="h-full w-full overflow-hidden rounded-md bg-black flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="p-4 pt-2 flex-shrink-0">
          <Button
            onClick={isActive ? stopCamera : startCamera}
            variant={isActive ? "destructive" : "default"}
            className="w-full gap-2"
            data-testid={isActive ? "button-stop-camera" : "button-start-camera"}
          >
            {isActive ? (
              <>
                <VideoOff className="h-4 w-4" />
                Stop Camera
              </>
            ) : (
              <>
                <Video className="h-4 w-4" />
                Start Camera
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}