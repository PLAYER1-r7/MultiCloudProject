import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { buildMarkdownPageHtml, renderHtmlToPdf, renderMarkdownFileToPdf } from './render-markdown-to-pdf.mjs';

const repoRoot = path.resolve(process.cwd(), '../..');
const issuesDir = path.join(repoRoot, 'docs/portal/issues');
const outputDir = path.join(issuesDir, 'pdf');
const manifestPath = path.join(outputDir, 'closed-issues-manifest.json');
const combinedPdfPath = path.join(outputDir, 'closed-issues-compendium.pdf');

function readClosedIssuesFromGithub() {
  const output = execFileSync(
    'gh',
    [
      'issue',
      'list',
      '--repo',
      'PLAYER1-r7/MultiCloudProject',
      '--state',
      'closed',
      '--limit',
      '200',
      '--json',
      'number,title,updatedAt,url,labels',
    ],
    {
      cwd: repoRoot,
      encoding: 'utf8',
    },
  );

  return JSON.parse(output);
}

async function findIssueFile(issueNumber) {
  const files = await fs.readdir(issuesDir);
  return files.find((file) => file.startsWith(`issue-${String(issueNumber).padStart(2, '0')}-`) || file.startsWith(`issue-${issueNumber}-`));
}

function formatDate(value) {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value));
}

function mergeIssueDocuments(summaryHtml, issueBodies) {
  const body = issueBodies
    .map(
      (html) => `
        <section style="page-break-before: always; break-before: page;">
          ${html}
        </section>`,
    )
    .join('');

  return summaryHtml.replace('</main>', `${body}</main>`);
}

function extractMainMarkup(documentHtml) {
  const match = documentHtml.match(/<main>([\s\S]*)<\/main>/);
  return match ? match[1] : documentHtml;
}

function buildCombinedHtml({ renderedIssues, skippedIssues }) {
  const summaryMarkdown = [
    '# closed Issue 一括 PDF',
    '',
    `- 生成日: ${formatDate(new Date().toISOString())}`,
    `- 収録件数: ${renderedIssues.length}`,
    `- 未収録件数: ${skippedIssues.length}`,
    '',
    '## 収録対象',
    '',
    '| Issue | タイトル | 更新日 | PDF |',
    '| --- | --- | --- | --- |',
    ...renderedIssues.map((issue) => `| #${issue.number} | ${issue.title} | ${issue.updatedAtJa} | ${issue.pdfName} |`),
    '',
    ...(skippedIssues.length
      ? [
          '## 未収録',
          '',
          '| Issue | 理由 |',
          '| --- | --- |',
          ...skippedIssues.map((issue) => `| #${issue.number} | ${issue.reason} |`),
          '',
        ]
      : []),
  ].join('\n');

  const summaryHtml = buildMarkdownPageHtml({
    title: 'closed Issue 一括 PDF',
    markdownText: summaryMarkdown,
    intro: 'GitHub 上で closed の状態にあり、ローカル issue 文書が存在する記録をまとめて PDF 化した一覧。',
  });

  return mergeIssueDocuments(
    summaryHtml,
    renderedIssues.map((issue) => issue.htmlBody),
  );
}

async function main() {
  const closedIssues = readClosedIssuesFromGithub().sort((left, right) => left.number - right.number);
  const renderedIssues = [];
  const skippedIssues = [];

  await fs.mkdir(outputDir, { recursive: true });

  for (const issue of closedIssues) {
    const localFile = await findIssueFile(issue.number);

    if (!localFile) {
      skippedIssues.push({
        number: issue.number,
        reason: 'ローカル issue 文書が存在しない',
      });
      continue;
    }

    const inputPath = path.join(issuesDir, localFile);
    const pdfName = `${path.basename(localFile, '.md')}.pdf`;
    const outputPath = path.join(outputDir, pdfName);
    const sourcePath = path.relative(repoRoot, inputPath);
    const updatedAtJa = formatDate(issue.updatedAt);
    const title = `Issue #${issue.number} ${issue.title}`;
    const intro = 'GitHub で closed になっている issue 記録を、そのまま参照用 PDF に変換したもの。';

    await renderMarkdownFileToPdf({
      inputPath,
      outputPath,
      title,
      issueNumber: issue.number,
      sourcePath,
      githubUrl: issue.url,
      updatedAt: updatedAtJa,
      labels: issue.labels,
      intro,
    });

    const markdownText = await fs.readFile(inputPath, 'utf8');

    renderedIssues.push({
      number: issue.number,
      title: issue.title,
      updatedAtJa,
      pdfName,
      sourcePath,
      htmlBody: extractMainMarkup(
        buildMarkdownPageHtml({
          title,
          markdownText,
          issueNumber: issue.number,
          sourcePath,
          githubUrl: issue.url,
          updatedAt: updatedAtJa,
          labels: issue.labels,
          intro,
        }),
      ),
    });
  }

  const combinedHtml = buildCombinedHtml({ renderedIssues, skippedIssues });
  await renderHtmlToPdf({
    html: combinedHtml,
    outputPath: combinedPdfPath,
    headerTitle: 'closed Issue 一括 PDF',
  });

  await fs.writeFile(
    manifestPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        combinedPdf: path.relative(repoRoot, combinedPdfPath),
        renderedIssues: renderedIssues.map(({ htmlBody, ...issue }) => issue),
        skippedIssues,
      },
      null,
      2,
    ),
  );

  console.log(
    JSON.stringify(
      {
        renderedCount: renderedIssues.length,
        skippedCount: skippedIssues.length,
        combinedPdf: path.relative(repoRoot, combinedPdfPath),
        outputDir: path.relative(repoRoot, outputDir),
        manifest: path.relative(repoRoot, manifestPath),
      },
      null,
      2,
    ),
  );
}

await main();