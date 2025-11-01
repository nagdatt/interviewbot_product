// In CameraCard.tsx - Update to make internal components responsive
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Video, VideoOff, Square, PlayCircle, FileText, CheckCircle2, X, Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function CameraCard({ className = "", onSaveVideoAnswer, speechLang }: { className?: string; onSaveVideoAnswer?: (videoUrl: string, transcript?: string) => void; speechLang?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>("");
  const [transcript, setTranscript] = useState("");
  const [previewTranscript, setPreviewTranscript] = useState("");

  // Initialize speech recognition on mount
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = speechLang || (navigator.language || "en-US");

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece + " ";
          }
        }
        
        if (finalTranscript) {
          transcriptRef.current += finalTranscript;
          setTranscript(transcriptRef.current);
          console.log("Transcript updated:", transcriptRef.current);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          console.error("Microphone permission denied");
        }
      };

      recognitionRef.current.onend = () => {
        console.log("Speech recognition ended");
      };
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors when stopping
        }
      }
    };
  }, [speechLang]);

  const startRecording = async () => {
    try {
      const recordStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const recorder = new MediaRecorder(recordStream);
      chunksRef.current = [];
      transcriptRef.current = ""; // Reset transcript for new recording
      setTranscript(""); // Reset state
      setPreviewTranscript(""); // Reset preview
      
      // show live preview during recording
      if (videoRef.current) {
        videoRef.current.srcObject = recordStream;
      }
      setStream(recordStream);
      setIsActive(true);
      
      // Start speech recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          console.log("Speech recognition started");
        } catch (err: any) {
          // If already started, stop and restart
          if (err.message && err.message.includes("already")) {
            recognitionRef.current.stop();
            setTimeout(() => {
              recognitionRef.current.start();
              console.log("Speech recognition restarted");
            }, 100);
          } else {
            console.error("Error starting speech recognition:", err);
          }
        }
      }
      
      recorder.ondataavailable = (e: BlobEvent) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        // Stop speech recognition and capture final transcript
        let finalTranscript = transcriptRef.current;
        
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch (e) {
            // Ignore stop errors
          }
        }
        
        // Wait a bit to ensure all final transcript pieces are captured
        setTimeout(() => {
          finalTranscript = transcriptRef.current;
          console.log("Final transcript captured:", finalTranscript);
          
          recordStream.getTracks().forEach(t => t.stop());
          if (videoRef.current) {
            videoRef.current.srcObject = null;
          }
          setStream(null);
          setIsActive(false);
          const blob = new Blob(chunksRef.current, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          setPreviewUrl(url);
          setPreviewTranscript(finalTranscript);
          setIsPreviewOpen(true);
        }, 500);
      };
      recorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (e) {
      console.error("Unable to start recording:", e);
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && isRecording) {
      recorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const saveRecorded = () => {
    if (previewUrl && onSaveVideoAnswer) {
      onSaveVideoAnswer(previewUrl, previewTranscript);
      setIsPreviewOpen(false);
      setPreviewTranscript("");
      setTranscript("");
    }
  };

  return (
    <Card className={`overflow-hidden backdrop-blur-md bg-card/70 border-card-border flex flex-col ${className}`}>
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
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm sm:text-base">Camera Feed</CardTitle>
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "outline"}
              className="gap-2"
              data-testid={isRecording ? "button-stop-video-answer" : "button-start-video-answer"}
            >
              {isRecording ? (
                <>
                  <Square className="h-4 w-4" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Video className="h-4 w-4" />
                  Record Video Answer
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader className="pb-4 border-b flex-shrink-0">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Video className="h-5 w-5 text-primary" />
              </div>
              Recorded Video Preview
            </DialogTitle>
          </DialogHeader>
          {previewUrl && (
            <div className="flex-1 min-h-0 flex flex-col space-y-4 pt-4">
              {/* Video Player Section */}
              <div className="relative group flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg pointer-events-none z-10" />
                <video 
                  src={previewUrl} 
                  controls 
                  className="w-full rounded-lg shadow-lg bg-black aspect-video object-contain max-h-[50vh]"
                />
              </div>
              
              {/* Transcript Section - Scrollable */}
              <div className="flex-1 min-h-0 flex flex-col rounded-lg bg-gradient-to-br from-background to-muted/30 border shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 mb-3 p-4 pb-3 flex-shrink-0 border-b">
                  <div className="p-1.5 bg-primary/10 rounded-md">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold">Transcribed Text</h3>
                  {previewTranscript && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Available
                    </Badge>
                  )}
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto bg-background/80 p-4">
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {previewTranscript || (
                      <span className="text-muted-foreground italic">
                        No transcript available. Please ensure your microphone is enabled and try again.
                      </span>
                    )}
                  </p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2  flex-shrink-0">
                <Button 
                  onClick={saveRecorded}
                  className="gap-2 bg-primary hover:bg-primary/90"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Add to My Answers
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}