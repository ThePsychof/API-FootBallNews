import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import backgroundImage from "./assets/backGround.png";
import Messi from "./assets/Messi.png";
import Ronaldo from "./assets/Ronaldo.png";
import RedFireBall from "./assets/RedFireBall.png";
import BlueFireBall from "./assets/BlueFireBall.png";
import "./Entery.css";
import Football from "./Football";

function Appear() {
  const [formData, setFormData] = useState({
    Match_API: "",
    Match_URL: "",
    News_API: "",
    News_URL: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [showScene, setShowScene] = useState(true);

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => setShowScene(false), 1950);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (!showScene && submitted) {
    return (
      <Football
        apiToken1={formData.Match_API || "null"}
        newsApiUrl1={formData.Match_URL || "null"}
        apiToken2={formData.News_API || "null"}
        newsApiUrl2={formData.News_URL || "null"}
        
      />
    );
  }

  return (
    <div className={`box${!showScene && submitted ? " inactive" : ""}`}>
      {/* Background */}
      <motion.img
        src={backgroundImage}
        alt="backGround"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "spring", stiffness: 50, damping: 10, delay: 0.5 }}
        className="Background"
      />

      {/* Messi */}
      <motion.img
        src={Messi}
        alt="Messi"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "spring", stiffness: 50, damping: 10, delay: 0.8 }}
        className="Messi"
      />

      {/* Ronaldo */}
      <motion.img
        src={Ronaldo}
        alt="Ronaldo"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "spring", stiffness: 50, damping: 10, delay: 0.8 }}
        className="Ronaldo"
      />

      {/* API Form */}
      {!submitted && (
        <motion.form
          onSubmit={handleSubmit}
          className="entry-form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "spring", stiffness: 50, damping: 10, delay: 1 }}
        >
          <input
            type="text"
            name="Match_API"
            placeholder="Match API Token"
            value={formData.Match_API}
            onChange={handleChange}
          />
          <input
            type="text"
            name="Match_URL"
            placeholder="Match API URL"
            value={formData.Match_URL}
            onChange={handleChange}
          />
          <input
            type="text"
            name="News_API"
            placeholder="News API Token"
            value={formData.News_API}
            onChange={handleChange}
          />
          <input
            type="text"
            name="News_URL"
            placeholder="News API URL"
            value={formData.News_URL}
            onChange={handleChange}
          />
          <button type="submit">Submit</button>
        </motion.form>
      )}

      {/* Fireballs */}
      {submitted && (
        <>
          <motion.img
            src={RedFireBall}
            alt="RedFireBall"
            className="RedFireBall"
            initial={{ opacity: 0, left: "8%", bottom: "8%" }}
            animate={{ opacity: 1, left: "37.5%", bottom: "40%" }}
            transition={{ type: "spring", stiffness: 50, damping: 10, delay: 1.5 }}
          />
          <motion.img
            src={BlueFireBall}
            alt="BlueFireBall"
            className="BlueFireBall"
            initial={{ opacity: 0, right: "8%", bottom : "8%" }}
            animate={{ opacity: 1, right: "37.5%", bottom: "40%" }}
            transition={{ type: "spring", stiffness: 50, damping: 10, delay: 1.5 }}
          />
        </>
      )}
    </div>
  );
}

export default Appear;