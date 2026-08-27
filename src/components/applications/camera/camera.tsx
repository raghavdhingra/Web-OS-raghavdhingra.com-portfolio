import { useCallback, useEffect, useRef, useState } from "react";
import { connect, type ConnectedProps } from "react-redux";
import type { RootState } from "@/store/store";
import type { ActivitySupplement } from "@/types/models";
import DOWNLOAD_ICON from "../../../assets/icons/download.svg";
import STOP_WATCH from "../../../assets/icons/stopwatch.svg";
import "../../../assets/applications/camera.css";

interface CameraOwnProps {
  supplement: ActivitySupplement;
}

const Camera = ({
  supplement,
  triggerIndex,
  isTriggered,
  activityList,
}: CameraOwnProps & ConnectedProps<typeof connector>) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runningTimer = useRef<HTMLDivElement>(null);

  const [timer, setTimer] = useState(0);
  const [isCaptured, setIsCaptured] = useState(false);
  const [mediaObject, setMediaObject] = useState<MediaStreamTrack | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const drawOnCanvas = useCallback(() => {
    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const width = video.offsetWidth;
      canvas.height = (width * 9) / 16;
      canvas.width = width;
      ctx.drawImage(video, 0, 0, width, (width * 9) / 16);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width / 2; x++) {
          const i = (y * canvas.width + x) * 4;
          const mirrorI = (y * canvas.width + (canvas.width - 1 - x)) * 4;

          for (let j = 0; j < 4; j++) {
            const temp = data[i + j];
            data[i + j] = data[mirrorI + j];
            data[mirrorI + j] = temp;
          }
        }
      }
      ctx.putImageData(imageData, 0, 0);

      setIsCapturing(false);
    } catch {
      return null;
    }
  }, []);

  const captureMoment = useCallback(() => {
    setIsCapturing(true);
    if (isCaptured) {
      setIsCaptured(false);
    }
    setTimeout(() => {
      drawOnCanvas();
      setIsCaptured(true);
    }, timer * 1000);
  }, [drawOnCanvas, isCaptured, timer]);

  const stopCamera = useCallback(
    () => mediaObject && mediaObject.stop(),
    [mediaObject]
  );

  const changeTimer = useCallback(() => {
    const timeArray = [0, 2, 5, 10];
    const index = timeArray.indexOf(timer);
    setTimer(
      index === timeArray.length - 1 ? timeArray[0] : timeArray[index + 1]
    );
  }, [timer]);

  const downloadImage = useCallback(() => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "camera-screenshot.png";
    link.href = canvasRef.current.toDataURL();
    link.click();
  }, []);

  useEffect(() => {
    const indexToRemove = activityList.findIndex(
      (e: (typeof activityList)[number]) => e.date === supplement.activity.date
    );
    if (indexToRemove === triggerIndex && isTriggered) stopCamera();
  }, [triggerIndex, isTriggered, activityList, stopCamera, supplement]);

  useEffect(() => {
    let videoStream: MediaStream | undefined;
    if (videoRef) {
      const getVideoStream = async () => {
        try {
          videoStream = await navigator.mediaDevices.getUserMedia({
            video: {
              aspectRatio: 16 / 9,
            },
            audio: false,
          });
          if (videoRef.current) {
            videoRef.current.srcObject = videoStream;
            videoRef.current?.play();
            setMediaObject(videoStream.getTracks()[0]);
          }
        } catch {
          console.log("Camera permission not given");
        }
      };
      getVideoStream();
    }
    return () => {
      if (videoStream) videoStream.getTracks()[0].stop();
    };
  }, []);

  useEffect(() => {
    if (isCapturing && timer && runningTimer.current) {
      let latestTimer = timer;
      runningTimer.current.innerHTML = `<span class="fade-out-anim">${timer}</span>`;
      const interval = setInterval(() => {
        if (latestTimer === 0) clearInterval(interval);
        else {
          latestTimer = latestTimer - 1;
          try {
            if (runningTimer.current)
              runningTimer.current.innerHTML = `<span class="fade-out-anim">${latestTimer}</span>`;
          } catch {
            return null;
          }
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isCapturing, timer]);

  return (
    <>
      <div className="camera-container">
        <video className="camera-video-container" ref={videoRef}></video>
        <div className="camera-container-overlay">
          <div />
          <div>
            <div className="camera-button-container">
              <div className="camera-button-upper-container">
                <div className="camera-timer-container" onClick={changeTimer}>
                  <img src={STOP_WATCH} alt="Stop Watch" />
                  {timer}s
                </div>
              </div>
              <svg
                className="camera-capture-button-svg"
                onClick={captureMoment}
              >
                <circle
                  cx="2rem"
                  cy="2rem"
                  r="1.5rem"
                  className="camera-capture-button"
                />
              </svg>
              <div />
            </div>
          </div>
        </div>
        {isCapturing && (
          <div className="timer-container" ref={runningTimer}></div>
        )}
      </div>
      <div
        className="captured-image"
        style={{ display: isCaptured ? "block" : "none" }}
      >
        {isCaptured && (
          <button
            className="image-download-button-canvas button-base"
            onClick={downloadImage}
          >
            <img
              alt="download icon"
              src={DOWNLOAD_ICON}
              height={10}
              width={10}
            />
          </button>
        )}
        {isCaptured && (
          <button
            className="image-close-button-canvas button-base"
            onClick={() => setIsCaptured(false)}
          >
            &times;
          </button>
        )}
        <canvas ref={canvasRef} />
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  triggerIndex: state.activityReducers.triggerIndex,
  isTriggered: state.activityReducers.isTriggered,
  activityList: state.activityReducers.activity,
});

const connector = connect(mapStateToProps);
export default connector(Camera);
