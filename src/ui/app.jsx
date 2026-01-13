const { useState, useEffect, useRef } = React;

function Toast({ message, show, onHide }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  if (!show) return null;

  return (
    <div className="toast">
      <span className="toast-icon">✓</span>
      <span className="toast-message">{message}</span>
    </div>
  );
}

function ColorCard({ color, onClick, onCopy }) {
  const handleClick = (e) => {
    // If clicking on the hex text, copy to clipboard
    if (e.target.classList.contains('color-hex')) {
      e.stopPropagation();
      navigator.clipboard.writeText(color.hex).then(() => {
        onCopy(color.hex);
        // Show temporary feedback on the text
        const originalText = e.target.textContent;
        e.target.textContent = 'Copied!';
        e.target.style.color = '#007bff';
        setTimeout(() => {
          e.target.textContent = originalText;
          e.target.style.color = '';
        }, 1000);
      });
    } else {
      // Otherwise, show details
      onClick(color);
    }
  };

  return (
    <div className="color-card" onClick={handleClick}>
      <div 
        className="color-swatch" 
        style={{ backgroundColor: color.hex }}
      />
      <div className="color-info">
        <div className="color-hex" title="Click to copy">{color.hex}</div>
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

function Suggestions({ suggestions, stats, onCopy }) {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      onCopy(text);
    });
  };

  const copyColorToClipboard = (color, event) => {
    event.stopPropagation();
    navigator.clipboard.writeText(color).then(() => {
      onCopy(color);
      // Show temporary feedback
      const originalTitle = event.target.title;
      event.target.title = 'Copied!';
      event.target.style.transform = 'scale(1.15)';
      event.target.style.boxShadow = '0 4px 12px rgba(0,123,255,0.4)';
      setTimeout(() => {
        event.target.title = originalTitle;
        event.target.style.transform = '';
        event.target.style.boxShadow = '';
      }, 1000);
    });
  };

  const openInCoolors = (colors) => {
    // Convert hex colors to coolors.co format (remove # and join with dashes)
    const colorCodes = colors.map(color => color.replace('#', '')).join('-');
    const coolorsUrl = `https://coolors.co/${colorCodes}`;
    window.open(coolorsUrl, '_blank');
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
                    title={`${color} - Click to copy`}
                    onClick={(e) => copyColorToClipboard(color, e)}
                  />
                ))}
              </div>
              <div className="merge-suggested">
                <span style={{ fontSize: '0.875rem', color: '#666' }}>Suggested merge:</span>
                <div 
                  className="merge-color-swatch"
                  style={{ backgroundColor: merge.suggestedColor }}
                  title={`${merge.suggestedColor} - Click to copy`}
                  onClick={(e) => copyColorToClipboard(merge.suggestedColor, e)}
                />
                <span 
                  style={{ fontFamily: 'Monaco, Courier New, monospace', fontSize: '0.875rem', cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    copyColorToClipboard(merge.suggestedColor, e);
                  }}
                  title="Click to copy"
                >
                  {merge.suggestedColor}
                </span>
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <button
                  className="coolors-button"
                  onClick={() => openInCoolors(merge.colors)}
                  title="Open palette in Coolors.co"
                >
                  🎨 Open in Coolors.co
                </button>
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
  const [toast, setToast] = useState({ show: false, message: '' });
  const [watchMode, setWatchMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const dataRef = useRef({ allColors: [], suggestions: {}, stats: null });

  const handleCopy = (text) => {
    setToast({ show: true, message: `Copied ${text} to clipboard!` });
  };

  useEffect(() => {
    let mounted = true;

    const fetchData = async (silent = false) => {
      try {
        if (!silent) {
          setIsUpdating(true);
        }
        
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

        if (!mounted) return;

        // Only update if data actually changed (avoid unnecessary re-renders)
        const colorsChanged = JSON.stringify(colorsData) !== JSON.stringify(dataRef.current.allColors);
        const suggestionsChanged = JSON.stringify(suggestionsData) !== JSON.stringify(dataRef.current.suggestions);
        const statsChanged = JSON.stringify(statsData) !== JSON.stringify(dataRef.current.stats);

        if (colorsChanged || suggestionsChanged || statsChanged || !silent) {
          dataRef.current = { allColors: colorsData, suggestions: suggestionsData, stats: statsData };
          setAllColors(colorsData);
          setColors(colorsData);
          setSuggestions(suggestionsData);
          setStats(statsData);
          if (colorsChanged || suggestionsChanged || statsChanged) {
            setLastUpdate(new Date());
          }
        }

        if (!silent) {
          setLoading(false);
        }
      } catch (err) {
        if (!mounted) return;
        if (!silent) {
          setError(err.message);
          setLoading(false);
        }
      } finally {
        if (mounted) {
          setIsUpdating(false);
        }
      }
    };

    // Check if watch mode is enabled
    async function checkWatchMode() {
      try {
        const res = await fetch('/api/watch-mode');
        const data = await res.json();
        if (mounted) {
          setWatchMode(data.enabled);
        }
      } catch (err) {
        // If endpoint fails, assume watch mode is off
        if (mounted) {
          setWatchMode(false);
        }
      }
    }

    fetchData();
    checkWatchMode();

    // Poll for updates when watch mode is enabled
    let pollInterval = null;
    if (watchMode) {
      pollInterval = setInterval(() => {
        fetchData(true); // Silent update
      }, 3000); // Poll every 3 seconds
    }

    return () => {
      mounted = false;
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [watchMode]);

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <div>
            <h1>Tailwind Color Visualizer</h1>
            <p>Visualize and analyze arbitrary color values in your Tailwind CSS project</p>
          </div>
          {watchMode && (
            <div className="watch-mode-indicator">
              <span className="watch-mode-dot"></span>
              <span>Watch Mode</span>
              {isUpdating && <span className="updating-text">Updating...</span>}
            </div>
          )}
        </div>
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
            {lastUpdate && (
              <div className="stat">
                <div className="stat-label">Last Update</div>
                <div className="stat-value" style={{ fontSize: '0.875rem' }}>
                  {lastUpdate.toLocaleTimeString()}
                </div>
              </div>
            )}
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
            onCopy={handleCopy}
          />
        ))}
      </div>

      {colors.length === 0 && selectedFilter !== 'all' && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          No colors found for "{selectedFilter}" utility class
        </div>
      )}

      <Suggestions suggestions={suggestions} stats={stats} onCopy={handleCopy} />

      <Toast 
        message={toast.message} 
        show={toast.show} 
        onHide={() => setToast({ show: false, message: '' })} 
      />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
