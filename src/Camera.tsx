import { useCallback, useRef, useState } from "react";
import selfie from "@mediapipe/selfie_segmentation/";
import styles from "./Camera.module.scss";
import { useBG } from "./context/bgContext";

function Camera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useCallback(
    (node: HTMLDivElement | null) => {
      let s: selfie.SelfieSegmentation;
      let ready: boolean;
      function onResults(results: any) {
        const canvasElement = canvasRef.current;
        if (!canvasElement) return;
        const canvasCtx = canvasElement.getContext("2d");
        if (!canvasCtx) return;
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(
          results.segmentationMask,
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );

        // Only overwrite existing pixels.
        canvasCtx.globalCompositeOperation = "source-in";
        // canvasCtx.fillStyle = "#FFF";
        // canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

        // Only overwrite missing pixels.
        // canvasCtx.globalCompositeOperation = "destination-atop";
        canvasCtx.drawImage(
          results.image,
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );

        canvasCtx.restore();
      }
      async function getMedia() {
        const media = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        return media;
      }

      async function getVideoElement() {
        const media = await getMedia();
        const videoElement = videoRef.current;
        if (!videoElement) {
          throw new Error("video element used while its ref still null");
        }
        videoElement.srcObject = media;
        return videoElement;
      }

      async function handleReceiveFrame(
        canvas: HTMLCanvasElement,
        video: HTMLVideoElement
      ) {
        function processFrame() {
          if (ready) {
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              throw new Error("canvas ctx not found");
            }
            ctx.drawImage(video, 0, 0, video.width, video.height);
            try {
              s.send({ image: canvas });
            } catch {}
            ctx.restore();
          }
          requestAnimationFrame(processFrame);
        }
        processFrame();
      }

      async function renderCanvas() {
        const video = await getVideoElement();
        const canvasElement = canvasRef.current;
        if (!canvasElement) {
          throw new Error("canvas element used while its ref still null");
        }
        handleReceiveFrame(canvasElement, video);
      }
      if (node !== null) {
        if (loading) {
          s = new selfie.SelfieSegmentation({
            locateFile: (file) => {
              console.log(file);
              return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/${file}`;
            },
          });

          s.setOptions({
            selfieMode: true,
            modelSelection: 1,
          });
          s.onResults(onResults);

          s.initialize().then(() => {
            ready = true;
            setLoading(false);
          });
        } else {
        }
        renderCanvas();
      }
    },
    [loading]
  );

  const { bg } = useBG();
  return (
    <div ref={containerRef} className={styles.container}>
      {loading && <div className={styles.loading}>Loading Dulu...</div>}
      <video
        width={1280}
        height={720}
        ref={videoRef}
        autoPlay
        className={styles.video}
      />
      <canvas
        ref={canvasRef}
        style={{ backgroundImage: `url(${bg})` }}
        className={styles.canvas}
        width={1280}
        height={720}
      />
    </div>
  );
}

export default Camera;
