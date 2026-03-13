import { chromium } from 'playwright';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [, , inputArg, outputArg] = process.argv;

if (!inputArg || !outputArg) {
  console.error('Usage: node ./scripts/render-html-to-pdf.mjs <input-html> <output-pdf>');
  process.exit(1);
}

const inputPath = path.resolve(process.cwd(), inputArg);
const outputPath = path.resolve(process.cwd(), outputArg);
const headerTitle = path.basename(inputPath, path.extname(inputPath));

const browser = await chromium.launch();

try {
  const page = await browser.newPage({
    viewport: {
      width: 1440,
      height: 2048,
    },
  });

  await page.goto(pathToFileURL(inputPath).href, {
    waitUntil: 'load',
  });
  await page.emulateMedia({ media: 'print' });
  await page.pdf({
    path: outputPath,
    format: 'A4',
    preferCSSPageSize: true,
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate:
      `<div style="width:100%;padding:0 10mm;font-size:8px;color:#5b6578;font-family:sans-serif;">${headerTitle}</div>`,
    footerTemplate:
      '<div style="width:100%;padding:0 10mm;font-size:8px;color:#5b6578;font-family:sans-serif;display:flex;justify-content:space-between;"><span>MultiCloudProject 参考資料</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
    margin: {
      top: '10mm',
      right: '0',
      bottom: '12mm',
      left: '0',
    },
  });
} finally {
  await browser.close();
}
