**My environment:**

* Puppeteer version: 8.0.0
* Platform / OS version: Windows 10 Pro
* Node.js version: 13.7.0


**What steps will reproduce the problem?**

* Clone the above GitHub repo in the local system and `cd` into it.
* Install the dependencies(`npm install`)
* Run the App using `node app.js` 

You should see below lines on the cmd/terminal.

![image](https://user-images.githubusercontent.com/15952676/109954379-47eeaf80-7d07-11eb-890c-cc82f593804a.png)


**Files: HTML template and Backend code**

HTML file: [Github link](https://github.com/himalayasingh/pdf-gen-issue-app/blob/master/assets/html/index.html)
(_HTML EMAIL template is provided by third party not written by me, I have to convert it to PDF_)


**Code which generates the PDF: [Github link](https://github.com/himalayasingh/pdf-gen-issue-app/blob/master/app.js)**

```
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
```


**What is the expected result?**

The generated PDF should look like this: [Screenshot of html file in chrome at 600px viewport](https://github.com/himalayasingh/pdf-gen-issue-app/blob/master/assets/img/Screenshot%20of%20webpage%20in%20chrome%20at%20600px%20viewport.png) 

In 600px width generated PDF file:
* the top two lines(containing "click here" links) should be on right side and both links should be clickable
* "image 1" and "image 3" should be visible
* "image 5" should be on left side of text next to it
* "image 6", "image 7" and "image 8" should be on **_one line adjacent to each-other_**.


**What happens instead?**

The generated 600px width PDF looks like this: [PDF generated using Puppeteer](https://github.com/himalayasingh/pdf-gen-issue-app/blob/master/assets/pdf/puppeteer-generated-pdf.pdf)

In generated PDF file:
* the top two lines(containing "click here" links) are on left side(_which should happen at 599px viewport_) and the first link whose href points to "_**%%view_email_url%%**_" if not clickable.
* "image 1" and "image 3" are **_invisible_** and "image 2" and "image 4" are **_visible_**(_which should happen at 596px viewport_)
* "image 5", "image 6", "image 7" and "image 8" are on **_separate lines_**(_which should happen at 599px viewport_).

**CSS rule for the top two lines(containing "click here" links)**
```
@media (max-width: 599px) {
          .trouble {
              text-align: left !important;
          } 
}
```

**CSS rules for image 1, 2, 3 and 4**
```
// Styles for "image 2" and "image 4"
@media only screen and (max-width: 596px) {
          .trigger-mobile {
              display: block !important;
              mso-hide: none !important;
          }
}
``` 

```
// Styles for "image 1" and "image 3"
@media only screen and (max-width: 596px) {
          .trigger-desktop {
              display: none !important;
              mso-hide: all !important;
          }
}
```

**CSS rules for image 5,6,7 and 8**
```
// Styles for "image 5" cover element
@media (max-width: 599px) {
          .cell1 {
              width: 100% !important;
              border-bottom: 1px solid #e7eff4 !important;
          }
}
``` 

```
// Styles for image 6, 7 and 8 cover element
@media (max-width: 599px) {
          .tbl {
              width: 100% !important;
              border-collapse: collapse;
          }
}
```
