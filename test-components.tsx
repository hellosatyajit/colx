// Test file with lots of Tailwind arbitrary color values
// This file is used to test the color visualizer tool

import React from 'react';

// Component with hex colors
export function HexColors() {
  return (
    <div className="container">
      <div className="bg-[#ff5733] p-4">Red background</div>
      <div className="bg-[#33ff57] p-4">Green background</div>
      <div className="bg-[#3357ff] p-4">Blue background</div>
      <div className="bg-[#ff33f5] p-4">Pink background</div>
      <div className="bg-[#f5ff33] p-4">Yellow background</div>
      <div className="text-[#ff5733]">Red text</div>
      <div className="text-[#33ff57]">Green text</div>
      <div className="text-[#3357ff]">Blue text</div>
      <div className="border-[#ff5733] border-2">Red border</div>
      <div className="border-[#33ff57] border-2">Green border</div>
    </div>
  );
}

// Component with RGB colors
export function RGBColors() {
  return (
    <div>
      <div className="bg-[rgb(255,87,51)]">RGB Red</div>
      <div className="bg-[rgb(51,255,87)]">RGB Green</div>
      <div className="bg-[rgb(51,87,255)]">RGB Blue</div>
      <div className="text-[rgb(255,87,51)]">RGB Text Red</div>
      <div className="text-[rgb(51,255,87)]">RGB Text Green</div>
      <div className="border-[rgb(51,87,255)] border-2">RGB Border Blue</div>
      <div className="ring-[rgb(255,87,51)] ring-2">RGB Ring Red</div>
    </div>
  );
}

// Component with RGBA colors
export function RGBAColors() {
  return (
    <div>
      <div className="bg-[rgba(255,87,51,0.5)]">RGBA Red 50%</div>
      <div className="bg-[rgba(51,255,87,0.8)]">RGBA Green 80%</div>
      <div className="bg-[rgba(51,87,255,0.3)]">RGBA Blue 30%</div>
      <div className="text-[rgba(255,87,51,0.7)]">RGBA Text</div>
      <div className="border-[rgba(51,255,87,0.6)] border-2">RGBA Border</div>
    </div>
  );
}

// Component with HSL colors
export function HSLColors() {
  return (
    <div>
      <div className="bg-[hsl(9,100%,50%)]">HSL Red</div>
      <div className="bg-[hsl(120,100%,50%)]">HSL Green</div>
      <div className="bg-[hsl(240,100%,50%)]">HSL Blue</div>
      <div className="bg-[hsl(60,100%,50%)]">HSL Yellow</div>
      <div className="text-[hsl(9,100%,50%)]">HSL Text</div>
      <div className="border-[hsl(120,100%,50%)] border-2">HSL Border</div>
    </div>
  );
}

// Component with HSLA colors
export function HSLAColors() {
  return (
    <div>
      <div className="bg-[hsla(9,100%,50%,0.5)]">HSLA Red 50%</div>
      <div className="bg-[hsla(120,100%,50%,0.8)]">HSLA Green 80%</div>
      <div className="bg-[hsla(240,100%,50%,0.3)]">HSLA Blue 30%</div>
      <div className="text-[hsla(9,100%,50%,0.7)]">HSLA Text</div>
    </div>
  );
}

// Component with duplicate colors (for CSS variable suggestions)
export function DuplicateColors() {
  return (
    <div>
      {/* These should suggest CSS variable consolidation */}
      <div className="bg-[#ff5733]">Duplicate 1</div>
      <div className="bg-[#ff5733]">Duplicate 2</div>
      <div className="bg-[#ff5733]">Duplicate 3</div>
      <div className="text-[#ff5733]">Duplicate 4</div>
      <div className="border-[#ff5733] border-2">Duplicate 5</div>
      
      {/* Another duplicate color */}
      <div className="bg-[rgb(51,255,87)]">Green 1</div>
      <div className="bg-[rgb(51,255,87)]">Green 2</div>
      <div className="text-[rgb(51,255,87)]">Green 3</div>
    </div>
  );
}

// Component with similar colors (for merge suggestions)
export function SimilarColors() {
  return (
    <div>
      {/* These colors are very similar - should suggest merging */}
      <div className="bg-[#ff5733]">Color 1</div>
      <div className="bg-[#ff5834]">Color 2 (very similar)</div>
      <div className="bg-[#ff5632]">Color 3 (very similar)</div>
      
      {/* Another group of similar colors */}
      <div className="bg-[#33ff57]">Green 1</div>
      <div className="bg-[#34ff58]">Green 2 (similar)</div>
    </div>
  );
}

// Component with various utility classes
export function VariousUtilities() {
  return (
    <div>
      <div className="from-[#ff5733] via-[#33ff57] to-[#3357ff] bg-gradient-to-r">
        Gradient colors
      </div>
      <div className="ring-[#ff5733] ring-2">Ring color</div>
      <div className="outline-[#33ff57] outline-2">Outline color</div>
      <div className="decoration-[#3357ff] underline">Decoration color</div>
      <div className="accent-[#ff5733]">Accent color</div>
      <div className="caret-[#33ff57]">Caret color</div>
      <div className="fill-[#3357ff]">Fill color</div>
      <div className="stroke-[#ff5733]">Stroke color</div>
      <div className="shadow-[#33ff57] shadow-lg">Shadow color</div>
    </div>
  );
}

// Component with 3-digit hex colors
export function ShortHexColors() {
  return (
    <div>
      <div className="bg-[#f73]">Short hex red</div>
      <div className="bg-[#3f7]">Short hex green</div>
      <div className="bg-[#37f]">Short hex blue</div>
      <div className="text-[#f73]">Short hex text</div>
    </div>
  );
}

// Component with uppercase hex
export function UppercaseHex() {
  return (
    <div>
      <div className="bg-[#FF5733]">Uppercase hex</div>
      <div className="bg-[#33FF57]">Uppercase hex green</div>
      <div className="text-[#3357FF]">Uppercase hex blue</div>
    </div>
  );
}

// Main component combining everything
export default function TestApp() {
  return (
    <div className="p-8">
      <h1 className="text-[#1a1a1a] text-4xl mb-8">Test Components</h1>
      
      <HexColors />
      <RGBColors />
      <RGBAColors />
      <HSLColors />
      <HSLAColors />
      <DuplicateColors />
      <SimilarColors />
      <VariousUtilities />
      <ShortHexColors />
      <UppercaseHex />
      
      {/* Inline styles with arbitrary values */}
      <div className="bg-[#e0e0e0] p-4 rounded-lg">
        <p className="text-[rgb(100,100,100)]">Mixed format test</p>
        <button className="bg-[hsl(200,80%,60%)] text-[#ffffff] px-4 py-2 rounded">
          Button with HSL bg and hex text
        </button>
      </div>
    </div>
  );
}
