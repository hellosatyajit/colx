const { useState, useEffect } = React;

function ColorCard({ color, onClick }) {
  return (
    <div className="color-card" onClick={() => onClick(color)}>
      <div 
        className="color-swatch" 
        style={{ backgroundColor: color.hex }}
      />
      <div className="color-info">
        <div className="color-hex">{color.hex}</div>
        <div className="color-format">{color.format}</div>
      </div>
    </div>
  );
}

function ColorDetails({ color, onClose }) {
  if (!color) return null;

  return (
    <div className="color-details active">
      <div className="color-details-header">
        <div 
          className="color-details-swatch"
          style={{ backgroundColor: color.hex }}
        />
        <div className="color-details-info">
          <h3>{color.hex}</h3>
          <div className="color-format">{color.format.toUpperCase()}</div>
          <div style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.875rem' }}>
            {color.occurrences.length} occurrence{color.occurrences.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
      <div>
        <h4 style={{ marginBottom: '0.75rem', fontSize: '0.875rem', color: '#666', textTransform: 'uppercase' }}>
          Used in:
        </h4>
        <ul className="occurrences-list">
          {color.occurrences.map((occ, idx) => (
            <li key={idx} className="occurrence-item">
              <span className="occurrence-file">{occ.file}</span>
              <span className="occurrence-line">:{occ.line}</span>
              <div style={{ marginTop: '0.25rem', color: '#999', fontSize: '0.75rem' }}>
                {occ.className}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Suggestions({ suggestions, stats }) {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  return (
    <div className="suggestions">
      <h2>Suggestions</h2>
      
      {suggestions.merges.length > 0 && (
        <div className="suggestion-section">
          <h3>Similar Colors (Consider Merging)</h3>
          {suggestions.merges.map((merge, idx) => (
            <div key={idx} className="merge-group">
              <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
                These colors are very similar (Delta E: {merge.similarity.toFixed(2)})
              </div>
              <div className="merge-colors">
                {merge.colors.map((color, colorIdx) => (
                  <div 
                    key={colorIdx}
                    className="merge-color-swatch"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <div className="merge-suggested">
                <span style={{ fontSize: '0.875rem', color: '#666' }}>Suggested merge:</span>
                <div 
                  className="merge-color-swatch"
                  style={{ backgroundColor: merge.suggestedColor }}
                  title={merge.suggestedColor}
                />
                <span style={{ fontFamily: 'Monaco, Courier New, monospace', fontSize: '0.875rem' }}>
                  {merge.suggestedColor}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {suggestions.merges.length === 0 && (
        <div style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
          No suggestions at this time. All colors are unique and well-organized!
        </div>
      )}
    </div>
  );
}

function FilterBar({ colors, selectedFilter, onFilterChange }) {
  // Extract unique utility prefixes from colors
  const utilityPrefixes = new Set();
  colors.forEach(color => {
    color.occurrences.forEach(occ => {
      // Extract prefix from className (e.g., "bg-[#ff5733]" -> "bg")
      const match = occ.className.match(/^([a-z]+)-\[/);
      if (match) {
        utilityPrefixes.add(match[1]);
      }
    });
  });

  const filters = ['all', ...Array.from(utilityPrefixes).sort()];

  return (
    <div className="filter-container">
      <div className="filter-title">Filter by Utility Class</div>
      <div className="filter-buttons">
        {filters.map(filter => (
          <button
            key={filter}
            className={`filter-button ${selectedFilter === filter ? 'active' : ''}`}
            onClick={() => onFilterChange(filter)}
          >
            {filter === 'all' ? 'All' : filter}
          </button>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [colors, setColors] = useState([]);
  const [allColors, setAllColors] = useState([]);
  const [suggestions, setSuggestions] = useState({ cssVariables: [], merges: [] });
  const [stats, setStats] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [colorsRes, suggestionsRes, statsRes] = await Promise.all([
          fetch('/api/colors'),
          fetch('/api/suggestions'),
          fetch('/api/stats')
        ]);

        if (!colorsRes.ok || !suggestionsRes.ok || !statsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const colorsData = await colorsRes.json();
        const suggestionsData = await suggestionsRes.json();
        const statsData = await statsRes.json();

        setAllColors(colorsData);
        setColors(colorsData);
        setSuggestions(suggestionsData);
        setStats(statsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading color data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  // Filter colors based on selected utility class
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    if (filter === 'all') {
      setColors(allColors);
    } else {
      const filtered = allColors.map(color => {
        const filteredOccurrences = color.occurrences.filter(occ => {
          const match = occ.className.match(/^([a-z]+)-\[/);
          return match && match[1] === filter;
        });
        return {
          ...color,
          occurrences: filteredOccurrences
        };
      }).filter(color => color.occurrences.length > 0);
      setColors(filtered);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Tailwind Color Visualizer</h1>
        <p>Visualize and analyze arbitrary color values in your Tailwind CSS project</p>
        {stats && (
          <div className="stats">
            <div className="stat">
              <div className="stat-label">Total Occurrences</div>
              <div className="stat-value">{stats.totalOccurrences}</div>
            </div>
            <div className="stat">
              <div className="stat-label">Unique Colors</div>
              <div className="stat-value">{stats.uniqueColors}</div>
            </div>
            <div className="stat">
              <div className="stat-label">Files Scanned</div>
              <div className="stat-value">{stats.filesScanned}</div>
            </div>
          </div>
        )}
      </div>

      <FilterBar 
        colors={allColors} 
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
      />

      {selectedColor && (
        <ColorDetails 
          color={selectedColor} 
          onClose={() => setSelectedColor(null)} 
        />
      )}

      <div className="palette-grid">
        {colors.map((color) => (
          <ColorCard 
            key={color.id} 
            color={color} 
            onClick={setSelectedColor}
          />
        ))}
      </div>

      {colors.length === 0 && selectedFilter !== 'all' && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          No colors found for "{selectedFilter}" utility class
        </div>
      )}

      <Suggestions suggestions={suggestions} stats={stats} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
