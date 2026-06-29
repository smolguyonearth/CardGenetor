# Card Generator

A tool to generate and export custom cards. It provides a web-based interface to preview the card design and a Node.js script for automated batch generation.

## Features
- **Web Interface:** Preview the card design and download a sample of the current card as a PNG using `html2canvas`.
- **Batch Generation (Node.js):** Read data from a CSV file and automatically generate high-quality PNGs for each row using `puppeteer`.

## Project Structure
- `index.html`, `style.css`, `script.js`: The frontend web application template.
- `generate.js`: The Node.js script for batch generating cards.
- `csv/`: Directory containing the source CSV files for the batch generator.
- `image/`: Directory where the batch generator outputs the generated PNGs.
- `example/`: Contains example assets like placeholder images.

## Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/smolguyonearth/CardGenetor
   cd "Card Filling"
   ```

2. **Install dependencies:**
   This is required to use the Node.js batch generation script.
   ```bash
   npm install
   ```

## Usage

### 1. Web Interface
1. Open `index.html` in your web browser.
2. You can view the card layout.
3. Click **"Download Sample"** to download the currently displayed card as an image.

### 2. Node.js Batch Generation
1. Place your data CSV file inside the `csv/` folder. The script looks for a CSV file in this directory. 
   - Note: The CSV is expected to have rows with the columns: `Name, Type, Background Color (Hex), Description`.

2. Run the generator script:
   ```bash
   node generate.js
   ```
3. The script will launch a headless browser, process each valid row in your CSV, and save the resulting PNGs into the `image/` folder.

### 3. Generate Card Back Image
1. To generate the standardized card back image, run the following script:
   ```bash
   node generate_back.js
   ```
2. The script will save `back-image.png` directly into your project folder based on the layout defined in `back.html`. You can also open `back.html` in your browser via a local server to download it manually.
