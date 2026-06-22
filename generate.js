const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// Function to properly parse CSV lines keeping quotes in mind
function parseCSV(str) {
    const arr = [];
    let quote = false;
    for (let row = 0, col = 0, c = 0; c < str.length; c++) {
        let cc = str[c], nc = str[c+1];
        arr[row] = arr[row] || [];
        arr[row][col] = arr[row][col] || '';
        
        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }
        if (cc == '"') { quote = !quote; continue; }
        if (cc == ',' && !quote) { ++col; continue; }
        if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }
        if (cc == '\n' && !quote) { ++row; col = 0; continue; }
        if (cc == '\r' && !quote) { ++row; col = 0; continue; }
        arr[row][col] += cc;
    }
    return arr;
}

const csvDir = path.join(process.cwd(), 'csv');
let csvFile = null;

// Look for a CSV file in the /csv folder
if (fs.existsSync(csvDir)) {
    const files = fs.readdirSync(csvDir);
    const target = files.find(f => f.endsWith('.csv'));
    if (target) {
        csvFile = path.join(csvDir, target);
    }
}

if (!csvFile) {
    console.error("Error: Could not find any .csv file in the 'csv' folder.");
    process.exit(1);
}

console.log(`Reading data from ${csvFile}...`);
const content = fs.readFileSync(csvFile, 'utf-8');
const rows = parseCSV(content);

(async () => {
    console.log("Starting browser engine...");
    const browser = await puppeteer.launch({ 
        headless: "new",
        args: ['--no-sandbox', '--allow-file-access-from-files'] 
    });
    const page = await browser.newPage();
    
    const fileUrl = 'file://' + path.join(process.cwd(), 'index.html');
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    // Wait for Google Fonts to be fully loaded before any captures
    await page.evaluate(async () => {
        await document.fonts.ready;
        // Double-check that specific fonts are loaded
        await document.fonts.load('700 84px "Frank Ruhl Libre"');
        await document.fonts.load('400 42px "Farsan"');
    });

    // Set viewport to match card dimensions (750x1050 = poker card at 300 DPI)
    await page.setViewport({ width: 750, height: 1050, deviceScaleFactor: 2 });

    const outDir = path.join(process.cwd(), 'image');
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir);
    }

    console.log(`Processing cards...`);
    
    // Start from row 1 to skip header
    for (let i = 1; i < rows.length; i++) {
        const columns = rows[i];
        
        // Skip empty or summary lines (like the counts at the bottom)
        if (columns.length < 4 || !columns[0] || !columns[0].trim() || columns[0] === 'count') continue;

        const name = columns[0].trim();
        const type = columns[1].trim();
        const bgColor = columns[2].trim();
        const description = columns[3].trim();
        
        console.log(`Generating PNG for: ${name}...`);

        // Update the card content in the browser
        await page.evaluate((n, t, bg, desc) => {
            document.querySelector('.card-title').textContent = n;
            document.querySelector('.card-type').innerText = t.toUpperCase() + '.';
            document.querySelector('.card-inner').style.backgroundColor = '#' + bg.replace('#', '');
            document.querySelector('.card-subtitle').innerText = desc;

            // Set text color: black for yellow background, white for everything else
            const textColor = bg.replace('#', '').toUpperCase() === 'FFC200' ? '#000' : '#fff';
            document.querySelector('.card-title').style.color = textColor;
            document.querySelector('.card-subtitle').style.color = textColor;
            document.querySelector('.card-type').style.color = textColor;
        }, name, type, bgColor, description);

        // Wait for fonts and rendering to settle
        await page.evaluate(() => document.fonts.ready);
        await new Promise(r => setTimeout(r, 300));

        // Screenshot just the card element as PNG
        const cardElement = await page.$('#card-node');
        const cleanName = name.replace(/[/\\?%*:|"<>]/g, '-');
        const outPath = path.join(outDir, `${cleanName}.png`);
        await cardElement.screenshot({ path: outPath, type: 'png', omitBackground: true });
    }

    await browser.close();
    console.log(`\n✅ Success! All cards have been saved as PNGs in the '${outDir}' folder.`);
})();