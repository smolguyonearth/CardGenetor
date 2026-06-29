const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
    console.log("Starting browser engine to generate back card...");
    const browser = await puppeteer.launch({ 
        headless: "new",
        args: ['--no-sandbox', '--allow-file-access-from-files'] 
    });
    const page = await browser.newPage();
    
    const fileUrl = 'file://' + path.join(process.cwd(), 'back.html');
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    // Wait for Google Fonts to be fully loaded
    await page.evaluate(async () => {
        await document.fonts.ready;
        await document.fonts.load('400 80px "Gveret Levin"');
    });

    // Set viewport to match card dimensions (750x1050)
    await page.setViewport({ width: 750, height: 1050, deviceScaleFactor: 2 });

    console.log("Saving back-image.png...");
    
    // Wait for fonts and rendering to settle
    await new Promise(r => setTimeout(r, 500));

    // Screenshot just the card element as PNG
    const cardElement = await page.$('#card-node');
    const outPath = path.join(process.cwd(), 'back_image/image.png');
    
    await cardElement.screenshot({ path: outPath, type: 'png', omitBackground: true });

    await browser.close();
    console.log(`\n✅ Success! The back card has been saved as '${outPath}'.`);
})();
