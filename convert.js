const puppeteer = require('puppeteer');
const fs = require('fs');

async function convertToPDF(startUrl) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let currentUrl = startUrl;
    let pageNumber = 1;
    let allContent = '';

    // Capture the initial page's styles
    await page.goto(startUrl, { waitUntil: 'networkidle0' });
    const styles = await page.evaluate(() => {
        return Array.from(document.styleSheets)
            .map(sheet => {
                try {
                    return Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n');
                } catch (e) {
                    console.log('Error accessing stylesheet:', e);
                    return '';
                }
            })
            .join('\n');
    });

    while (currentUrl) {
        console.log(`Processing page ${pageNumber}: ${currentUrl}`);
        await page.goto(currentUrl, { waitUntil: 'networkidle0' });

        // Extract the content of the current page, preserving HTML structure
        const pageContent = await page.evaluate(() => {
            const contentElement = document.querySelector('.page-inner') || document.body;
            return contentElement ? contentElement.outerHTML : '';
        });

        allContent += `
            <div class="page-break"></div>
            <div class="page-content">
                ${pageContent}
            </div>
        `;

        // Check for the next page link
        const nextPageUrl = await page.evaluate(() => {
            const nextLinks = Array.from(document.querySelectorAll('a.pagination-nav__link'));
            const nextLink = nextLinks.find(link => {
                const sublabel = link.querySelector('.pagination-nav__sublabel');
                return sublabel && sublabel.textContent.trim().toLowerCase() === 'next';
            });
            return nextLink ? nextLink.href : null;
        });

        if (nextPageUrl && nextPageUrl !== currentUrl) {
            currentUrl = nextPageUrl;
            pageNumber++;
        } else {
            currentUrl = null;
        }
    }

    // Create a full HTML document with captured styles
    const fullHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>GitBook Content</title>
            <style>
                ${styles}
                .page-break { page-break-after: always; }
                @media print {
                    .pagination-nav { display: none !important; }
                }
            </style>
        </head>
        <body>
            ${allContent}
        </body>
        </html>
    `;

    // Save the full HTML content
    fs.writeFileSync('gitbook_content.html', fullHtml);

    // Generate PDF from the HTML content
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
    await page.pdf({ 
        path: 'gitbook_output.pdf', 
        format: 'A4',
        printBackground: true,
        margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
        preferCSSPageSize: true
    });

    await browser.close();
    console.log('Conversion complete. Check gitbook_content.html and gitbook_output.pdf');
}

convertToPDF('https://docs.constellationnetwork.io/sdk/');