import React from 'react';
import { PlantStage } from '../types';

interface GrowingPlantProps {
  stage: PlantStage;
}

export const GrowingPlant: React.FC<GrowingPlantProps> = ({ stage }) => {
  const getPlantPixelArt = () => {
    // 32x32 Grid
    // Pot is always there
    const Pot = () => (
      <g>
        {/* Pot Rim */}
        <rect x="8" y="22" width="16" height="3" fill="#B45309" /> 
        <rect x="8" y="22" width="16" height="1" fill="#D97706" /> {/* Highlight */}
        {/* Pot Body */}
        <rect x="10" y="25" width="12" height="6" fill="#B45309" />
        <rect x="11" y="25" width="1" height="6" fill="#92400E" /> {/* Shadow */}
        {/* Soil */}
        <rect x="10" y="21" width="12" height="1" fill="#5D4037" />
      </g>
    );

    switch (stage) {
      case PlantStage.SEED:
        return (
          <g>
            <Pot />
            {/* Seed in soil */}
            <rect x="15" y="20" width="2" height="2" fill="#3E2723" />
          </g>
        );
      case PlantStage.SPROUT:
        return (
          <g>
            <Pot />
            {/* Stem */}
            <rect x="15" y="18" width="2" height="3" fill="#4ADE80" />
            {/* Leaves */}
            <rect x="13" y="17" width="2" height="1" fill="#22C55E" />
            <rect x="17" y="17" width="2" height="1" fill="#22C55E" />
          </g>
        );
      case PlantStage.SAPLING:
        return (
          <g>
            <Pot />
             {/* Tall Stem */}
            <rect x="15" y="12" width="2" height="9" fill="#4ADE80" />
            {/* Leaves Lower */}
            <rect x="12" y="16" width="3" height="1" fill="#22C55E" />
            <rect x="17" y="14" width="3" height="1" fill="#22C55E" />
            {/* Leaves Upper */}
            <rect x="13" y="11" width="2" height="1" fill="#22C55E" />
            <rect x="17" y="10" width="2" height="1" fill="#22C55E" />
          </g>
        );
      case PlantStage.BUD:
        return (
          <g>
            <Pot />
             {/* Stem */}
            <rect x="15" y="10" width="2" height="11" fill="#4ADE80" />
            {/* Leaves */}
            <rect x="11" y="18" width="4" height="1" fill="#22C55E" />
            <rect x="17" y="15" width="4" height="1" fill="#22C55E" />
            {/* Bud */}
            <rect x="14" y="6" width="4" height="4" fill="#F472B6" />
            <rect x="15" y="5" width="2" height="1" fill="#FBCFE8" />
          </g>
        );
      case PlantStage.BLOOM:
        return (
          <g>
            <Pot />
            {/* Stem */}
            <rect x="15" y="12" width="2" height="9" fill="#4ADE80" />
             {/* Leaves */}
            <rect x="10" y="19" width="5" height="1" fill="#22C55E" />
            <rect x="17" y="19" width="5" height="1" fill="#22C55E" />
            
            {/* Flower Center */}
            <rect x="14" y="7" width="4" height="4" fill="#FACC15" />
            
            {/* Petals */}
            <rect x="14" y="3" width="4" height="4" fill="#EC4899" /> {/* Top */}
            <rect x="14" y="11" width="4" height="4" fill="#EC4899" /> {/* Bottom */}
            <rect x="10" y="7" width="4" height="4" fill="#EC4899" /> {/* Left */}
            <rect x="18" y="7" width="4" height="4" fill="#EC4899" /> {/* Right */}
            
            {/* Corner Petals */}
            <rect x="11" y="4" width="2" height="2" fill="#DB2777" />
            <rect x="19" y="4" width="2" height="2" fill="#DB2777" />
            <rect x="11" y="12" width="2" height="2" fill="#DB2777" />
            <rect x="19" y="12" width="2" height="2" fill="#DB2777" />

            {/* Sparkles */}
            <rect x="8" y="4" width="1" height="1" fill="#FDE047" className="animate-pulse" />
            <rect x="24" y="5" width="1" height="1" fill="#FDE047" className="animate-pulse" />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative w-48 h-56 flex items-end justify-center">
      <svg width="256" height="256" viewBox="0 0 32 32" className="drop-shadow-lg pixel-art">
        {getPlantPixelArt()}
      </svg>
    </div>
  );
};