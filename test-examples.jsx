// Additional test file with more arbitrary color examples

import React from 'react';

// More duplicate colors for testing CSS variable suggestions
export function MoreDuplicates() {
  return (
    <>
      <div className="bg-[#aabbcc]">Color A</div>
      <div className="bg-[#aabbcc]">Color A again</div>
      <div className="bg-[#aabbcc]">Color A third time</div>
      <div className="text-[#aabbcc]">Color A as text</div>
      <div className="border-[#aabbcc] border-2">Color A as border</div>
      
      <div className="bg-[rgb(128,64,192)]">Purple 1</div>
      <div className="bg-[rgb(128,64,192)]">Purple 2</div>
      <div className="bg-[rgb(128,64,192)]">Purple 3</div>
    </>
  );
}

// Colors that should be detected as similar
export function MoreSimilarColors() {
  return (
    <>
      {/* Very close colors - should suggest merge */}
      <div className="bg-[#ff0000]">Pure red</div>
      <div className="bg-[#ff0100]">Almost pure red</div>
      <div className="bg-[#ff0001]">Almost pure red 2</div>
      
      {/* Another similar group */}
      <div className="bg-[#00ff00]">Pure green</div>
      <div className="bg-[#01ff00]">Almost pure green</div>
      
      {/* HSL similar colors */}
      <div className="bg-[hsl(180,50%,50%)]">Cyan 1</div>
      <div className="bg-[hsl(181,50%,50%)]">Cyan 2 (very similar)</div>
    </>
  );
}

// Complex component with nested colors
export function ComplexComponent() {
  const isActive = true;
  
  return (
    <div className="container bg-[#f5f5f5]">
      <header className="bg-[rgb(34,34,34)] text-[#ffffff] p-4">
        <h1 className="text-[#ffd700]">Header Title</h1>
        <nav>
          <a href="#" className="text-[#87ceeb] hover:text-[#ffd700]">
            Link 1
          </a>
        </nav>
      </header>
      
      <main className="bg-[#ffffff]">
        <section className="border-[#e0e0e0] border-2 p-6">
          <h2 className="text-[rgb(51,51,51)]">Section Title</h2>
          <p className="text-[#666666]">
            Paragraph text with color
          </p>
          
          <div className={`p-4 ${isActive ? 'bg-[#e8f5e9]' : 'bg-[#fff3e0]'}`}>
            Conditional background
          </div>
        </section>
        
        <aside className="bg-[rgba(0,0,0,0.05)] p-4">
          <h3 className="text-[hsl(0,0%,30%)]">Sidebar</h3>
          <ul>
            <li className="text-[#333333]">Item 1</li>
            <li className="text-[#333333]">Item 2</li>
            <li className="text-[#333333]">Item 3</li>
          </ul>
        </aside>
      </main>
      
      <footer className="bg-[#2c2c2c] text-[#cccccc] p-4">
        <p className="text-[#999999]">Footer text</p>
      </footer>
    </div>
  );
}

// Component with many different formats mixed
export function MixedFormats() {
  return (
    <div>
      {/* Hex variations */}
      <div className="bg-[#abc]">3-digit hex</div>
      <div className="bg-[#aabbcc]">6-digit hex</div>
      <div className="bg-[#ABC]">Uppercase 3-digit</div>
      <div className="bg-[#AABBCC]">Uppercase 6-digit</div>
      
      {/* RGB variations */}
      <div className="bg-[rgb(255,0,0)]">RGB no spaces</div>
      <div className="bg-[rgb( 255 , 0 , 0 )]">RGB with spaces</div>
      
      {/* HSL variations */}
      <div className="bg-[hsl(0,100%,50%)]">HSL standard</div>
      <div className="bg-[hsl( 0 , 100% , 50% )]">HSL with spaces</div>
      
      {/* RGBA variations */}
      <div className="bg-[rgba(255,0,0,0.5)]">RGBA decimal</div>
      <div className="bg-[rgba(255,0,0,0.50)]">RGBA decimal 2</div>
      
      {/* HSLA variations */}
      <div className="bg-[hsla(0,100%,50%,0.5)]">HSLA decimal</div>
    </div>
  );
}

// Real-world example: Card component
export function Card() {
  return (
    <div className="bg-[#ffffff] border-[#e5e7eb] border rounded-lg shadow-[#000000] shadow-sm p-6">
      <h3 className="text-[#111827] text-xl font-bold mb-2">
        Card Title
      </h3>
      <p className="text-[#6b7280] mb-4">
        Card description text
      </p>
      <button className="bg-[#3b82f6] text-[#ffffff] px-4 py-2 rounded hover:bg-[#2563eb]">
        Action Button
      </button>
    </div>
  );
}

// Real-world example: Alert component
export function Alert({ type = 'info' }) {
  const colors = {
    info: {
      bg: 'bg-[#dbeafe]',
      text: 'text-[#1e40af]',
      border: 'border-[#3b82f6]'
    },
    success: {
      bg: 'bg-[#d1fae5]',
      text: 'text-[#065f46]',
      border: 'border-[#10b981]'
    },
    warning: {
      bg: 'bg-[#fef3c7]',
      text: 'text-[#92400e]',
      border: 'border-[#f59e0b]'
    },
    error: {
      bg: 'bg-[#fee2e2]',
      text: 'text-[#991b1b]',
      border: 'border-[#ef4444]'
    }
  };
  
  const colorSet = colors[type] || colors.info;
  
  return (
    <div className={`${colorSet.bg} ${colorSet.text} ${colorSet.border} border-2 p-4 rounded`}>
      Alert message
    </div>
  );
}

export default function MoreTestExamples() {
  return (
    <div>
      <MoreDuplicates />
      <MoreSimilarColors />
      <ComplexComponent />
      <MixedFormats />
      <Card />
      <Alert type="info" />
      <Alert type="success" />
      <Alert type="warning" />
      <Alert type="error" />
    </div>
  );
}
