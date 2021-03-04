const express = require('express');
const fs = require('fs');
const puppeteer = require('puppeteer');

// Start: Setup an express server
const app = express();
const PORT = 8000;
app.listen(PORT, () => { 
    console.log(`Server started on port ${PORT}`);
});
// End: Setup an express server

(async () => {
    // Start: Puppeteer setup
    const browser = await puppeteer.launch({
        headless: true,
        slowMo: 0,
        timeout: 15000,
        ignoreHTTPSErrors: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    const width = 600,
    height = 1533;

    await page.setViewport({
        width,
        height
    });
    // End: Puppeteer setup

    // Start: Generate png screenshot from html file content
    const htmlContent = fs.readFileSync('./assets/html/index.html', 'utf8');
    await page.setContent(htmlContent);

    await page.emulateMediaType('screen');
    await page.waitForTimeout(1000);

    await page.screenshot({
        path: './assets/img/screenshot-using-puppeteer.png',
        fullPage: true,
        type: 'png'
    });
    console.log('Screenshot taken and stored!');
    // End: Generate png screenshot from html file content

    // Start: Generate PDF file from html file content
    const pdfOptions = {
        printBackground: true,
        width: `${width}px`,
        height: `${height + 1}px`,
        margin: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        path: './assets/pdf/puppeteer-generated-pdf.pdf',
        scale: 1
    }

    await page.pdf(pdfOptions);
    console.log('PDF generated and stored!');
    // End: Generate PDF file from html file content
})();
