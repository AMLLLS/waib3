"use client";

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

function LoaderComponent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-dark">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Stars
            radius={300}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />
        </Canvas>
      </div>

      <div className="relative flex flex-col items-center">
        {/* Logo WAIB */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-[2rem] font-aeonik font-black text-white mb-8 text-center relative"
        >
          <span className="bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent">
            WAIB
          </span>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0"
          />
        </motion.div>

        {/* Loader Circles */}
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1, 0] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
                repeatDelay: 0.1
              }}
              className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-primary-light"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default memo(LoaderComponent); 