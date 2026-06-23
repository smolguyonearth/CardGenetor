# Card Simulator

A modern, web-based card simulation application that allows you to simulate drawing generated cards from a deck. It pulls card images dynamically from the parent `image` directory and uses the `back_image` directory for the card backs.

## Features
- **Dynamic Asset Loading:** Automatically imports all generated cards from the `../image` directory.
- **Card Drawing Mechanics:** Click the draw pile to seamlessly reveal the top card.
- **Modern Black & White Aesthetic:** Features a stark, brutalist black and white design with high-contrast shadows.
- **Fluid Animations:** Includes an idle float animation on the draw pile, a stacked hover effect, and a 3D flip transition when drawing.

## Development Setup

This project is built using [Vite](https://vitejs.dev/) for lightning-fast development.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation

1. Navigate to the simulator directory (if you aren't already there):
   ```bash
   cd simulator
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be running locally at `http://localhost:3001`.

## File Structure
- `index.html`: The main entry point.
- `src/main.js`: Contains the logic for loading assets, shuffling the deck, and handling draw events.
- `src/style.css`: Contains the modern theme and CSS animations.
- `vite.config.js`: Configuration to serve the parent folder's images.
