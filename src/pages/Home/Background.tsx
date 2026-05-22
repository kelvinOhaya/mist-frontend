import {
  Cloud01Url,
  Cloud02Url,
  Cloud03Url,
  Cloud04Url,
  Cloud05Url,
  Cloud06Url,
  Cloud07Url,
  Cloud08Url,
} from "@clouds";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const cloudSrcList = [
  Cloud01Url,
  Cloud02Url,
  Cloud03Url,
  Cloud04Url,
  Cloud05Url,
  Cloud06Url,
  Cloud07Url,
  Cloud08Url,
];

export interface RenderedCloud {
  src: string;
  y: number;
  id: number;
  side: "left" | "right";
  width: number;
  duration: number;
}

const CLOUD_BASE_WIDTH = 115;
const MAX_ACTIVE_CLOUDS = 10;
const MIN_SPAWN_DELAY_MS = 2500;
const MAX_SPAWN_DELAY_MS = 8000;

export default function Background() {
  const [renderedClouds, setRenderedClouds] = useState<RenderedCloud[]>([]);

  const createCloud = (): RenderedCloud => {
    const side: RenderedCloud["side"] =
      getRandomInt(0, 1) === 0 ? "left" : "right";

    return {
      id: Date.now() + Math.floor(Math.random() * 1000),
      src: cloudSrcList[getRandomInt(0, cloudSrcList.length - 1)],
      side,
      y: getRandomInt(5, 95),
      width: Math.round((CLOUD_BASE_WIDTH * getRandomInt(60, 800)) / 100),
      // compute duration based on pixel distance so speed feels consistent across viewports
      // clouds travel from -20vw -> 120vw => 140vw total distance
      duration: (() => {
        const vwDistanceMultiplier = 1.4; // 140vw
        const pixelDistance = window.innerWidth * vwDistanceMultiplier;
        const basePxPerSec = 50; // user requested 50 px/s
        // small random variance ±10%
        const variance = Math.random() * 0.2 - 0.1;
        const pxPerSec = basePxPerSec * (1 + variance);
        const secs = Math.max(6, pixelDistance / pxPerSec);
        return Math.round(secs);
      })(),
    };
  };

  useEffect(() => {
    // seed a few clouds so the sky doesn't start empty
    const initialClouds: RenderedCloud[] = Array.from({ length: 3 }).map(() =>
      createCloud(),
    );

    setRenderedClouds(initialClouds);

    let timeoutId: number | undefined;

    const scheduleNextSpawn = () => {
      const nextDelay = getRandomInt(MIN_SPAWN_DELAY_MS, MAX_SPAWN_DELAY_MS);
      timeoutId = window.setTimeout(() => {
        setRenderedClouds((prev) => {
          if (prev.length >= MAX_ACTIVE_CLOUDS) {
            return prev;
          }

          return [...prev, createCloud()];
        });

        scheduleNextSpawn();
      }, nextDelay);
    };

    scheduleNextSpawn();

    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <div className="fixed h-full w-full top-0 left-0 z-3 flex items-start justify-center pointer-events-none">
      <AnimatePresence>
        {renderedClouds.map((cloud) => (
          <Cloud
            key={cloud.id}
            src={cloud.src}
            side={cloud.side}
            y={cloud.y}
            width={cloud.width}
            duration={cloud.duration}
            onAnimationComplete={() =>
              setRenderedClouds((prev) => prev.filter((e) => e.id !== cloud.id))
            }
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export interface CloudProps {
  src: string;
  y: number;
  side: "left" | "right";
  width: number;
  duration: number;
  onAnimationComplete: () => void;
}
function Cloud({
  src,
  y,
  onAnimationComplete,
  side,
  width,
  duration,
}: CloudProps) {
  const initialX = side === "left" ? "-20vw" : "120vw";
  const targetX = side === "left" ? "120vw" : "-20vw";
  return (
    <motion.div
      className={`absolute left-0 opacity-20 w-auto h-auto blur-2xl invert`}
      initial={{ x: initialX, y: `${y}vh` }}
      animate={{ x: targetX, y: `${y}vh` }}
      transition={{ duration, ease: "linear" }}
      onAnimationComplete={onAnimationComplete}
    >
      <motion.img
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8, transition: { duration: 2 } }}
        transition={{ duration: 2 }}
        src={src}
        style={{ width: `${width}px`, height: "auto" }}
        className="block"
        alt="cloud"
      />
    </motion.div>
  );
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
