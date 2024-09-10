# GitBook to PDF Scraper

This script is designed to scrape content from a GitBook documentation site and convert it into a PDF file while preserving as much of the original formatting as possible.

## Prerequisites

- Node.js installed on your system
- npm (Node Package Manager)

## Installation

1. Clone this repository or download the script file.
2. Navigate to the directory containing the script.
3. Run the following command to install the required dependencies:

   ```
   npm install puppeteer fs
   ```

## Usage

1. Open the `convert.js` file and modify the URL in the last line to point to the GitBook documentation you want to scrape:

   ```javascript
   convertToPDF('https://your-gitbook-url.com');
   ```

2. Run the script using Node.js:

   ```
   node convert.js
   ```

3. The script will generate two files in the same directory:
   - `gitbook_content.html`: An HTML file containing the scraped content with original styling.
   - `gitbook_output.pdf`: A PDF file of the scraped content, attempting to preserve the original format.

## How It Works

The script uses Puppeteer, a Node library that provides a high-level API to control Chrome or Chromium over the DevTools Protocol. Here's a breakdown of how the script works:

1. **Initialize**: The script launches a headless browser using Puppeteer.

2. **Scrape Content**: It starts at the provided URL and iterates through each page of the GitBook documentation:
   - It extracts the HTML content of each page.
   - It looks for a "Next" link to navigate to the next page.

3. **Capture Styles**: The script captures all CSS styles from the original page to preserve formatting.

4. **Compile Content**: As it scrapes each page, it compiles the content into a single HTML string, adding page breaks between each page.

5. **Generate Output**:
   - It saves the compiled HTML content to `gitbook_content.html`.
   - It uses Puppeteer to convert this HTML into a PDF, saved as `gitbook_output.pdf`.

6. **Clean Up**: Finally, it closes the browser.

## Limitations

- Some interactive elements or complex layouts may not translate perfectly to PDF.
- Content loaded dynamically (e.g., via JavaScript) might not be captured.
- The script assumes a specific structure for the "Next" link in the GitBook. If the GitBook uses a different structure, you may need to modify the script.

## Customization

You can modify the PDF output by adjusting the options in the `page.pdf()` call. For example, you can change the page format, margins, or other PDF-specific settings.

## Legal Considerations

Ensure you have the right to scrape and reproduce the content from the GitBook site you're targeting. Always respect the terms of service of the websites you interact with.

## Troubleshooting

If you encounter issues:
1. Check that the URL you're using is correct and accessible.
2. Ensure all dependencies are correctly installed.
3. Check the console for any error messages.

If problems persist, you may need to adjust the selectors used in the script to match the structure of the specific GitBook you're scraping.