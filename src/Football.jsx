import FireSplash from "./FireSplash";
import { motion, animate, useMotionValue } from "framer-motion";
import ball from "./assets/ball.png";
import Ring from "./assets/Ring.png";
import "./FootBall.css";
import RightPanel from "./RightPanel";
import LeftPanel from "./LeftPanel";
import { useRef, useEffect } from "react";

function Football(apiToken1, newsApiUrl1, apiToken2, newsApiUrl2) {
  const ballref = useRef(null);
  const radius = useMotionValue(0);
  const scaleFactor = 0.36;

  useEffect(() => {
    if (!ballref.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const newWidth = entry.contentRect.width;
        animate(radius, newWidth * scaleFactor, {
          type: "spring",
          stiffness: 120,
          damping: 20,
        });
      }
    });

    observer.observe(ballref.current);
    return () => observer.disconnect();
  }, [radius]);

  return (
    <div className="back">
      <FireSplash Radius={radius} />
      <RightPanel API_TOKEN={apiToken1} API_HOST={newsApiUrl1} />
      <LeftPanel apiToken={apiToken2} newsApiUrl={newsApiUrl2} />

      {/* Big ball */}
      <motion.img
        ref={ballref}
        src={ball}
        alt="ball"
        className="ball"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ type: "spring", stiffness: 50, damping: 10, delay: 0.1 }}
      />

      {/* Ring1 */}
      <motion.img
        src={Ring}
        alt="Ring1"
        className="Ring1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.45, rotate: 360 }}
        transition={{
          rotate: { duration: 10, repeat: Infinity, ease: "linear" },
        }}
      />

      {/* Ring2 */}
      <motion.img
        src={Ring}
        alt="Ring2"
        className="Ring2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.45, rotate: -360 }}
        transition={{
          rotate: { duration: 10, repeat: Infinity, ease: "linear" },
        }}
      />
    </div>
  );
}

export default Football;
