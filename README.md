# Tailwind Color Visualizer

A CLI tool that scans TypeScript/JSX files for Tailwind arbitrary color values, visualizes them in a coolors.co-style web UI, and provides suggestions for CSS variable consolidation and color merging opportunities.

## Features

- 🔍 **Scan** `.tsx` and `.jsx` files for Tailwind arbitrary color values
- 🎨 **Visualize** colors in a beautiful web interface (similar to coolors.co)
- 💡 **Suggest** CSS variable consolidation for duplicate colors
- 🔬 **Detect** similar colors and suggest merges using Delta E color difference
- 📊 **Statistics** about color usage across your codebase

## Installation

```bash
npm install -g colx
```

Or use with npx (no installation required):

```bash
npx colx [directory]
```

## Usage

### Basic Usage

Scan the current directory:

```bash
colx
```

Or specify a directory:

```bash
colx ./src
```

### Options

- `--port <number>` - Server port (default: 6969)
- `--no-open` - Don't open browser automatically
- `--threshold <number>` - Color similarity threshold for merge suggestions (default: 5)

### Examples

```bash
# Scan a specific directory
colx ./my-project/src

# Use a custom port
colx --port 8080

# Don't open browser automatically
colx --no-open

# Adjust similarity threshold (lower = more strict)
colx --threshold 3
```

## Supported Color Formats

The tool detects Tailwind arbitrary values in the following formats:

- **Hex**: `bg-[#ff5733]`, `text-[#ABC]`
- **RGB**: `bg-[rgb(255,87,51)]`
- **RGBA**: `bg-[rgba(255,87,51,0.5)]`
- **HSL**: `bg-[hsl(9,100%,50%)]`
- **HSLA**: `bg-[hsla(9,100%,50%,0.5)]`

## What It Does

1. **Scans** your codebase for `.tsx` and `.jsx` files
2. **Extracts** all Tailwind arbitrary color values
3. **Normalizes** colors to hex format for comparison
4. **Analyzes** color similarities using Delta E (CIEDE2000)
5. **Suggests** CSS variable consolidation for duplicate colors
6. **Suggests** color merges for visually similar colors
7. **Displays** everything in a beautiful web interface

## Output

The tool launches a web server and opens your browser to display:

- **Color Palette**: Grid view of all unique colors found
- **Color Details**: Click any color to see where it's used
- **Filter by Utility Class**: Filter colors by bg, text, border, etc.
- **Merge Suggestions**: Groups of similar colors that could be merged

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run in development mode (with Bun)
bun run src/index.ts

# Or with Node.js
npm run dev
```

## Requirements

- Node.js >= 16 (or Bun)
- TypeScript projects with `.tsx` or `.jsx` files
