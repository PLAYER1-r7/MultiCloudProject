import { chromium } from 'playwright';
import MarkdownIt from 'markdown-it';
import fs from 'node:fs/promises';
import path from 'node:path';

const markdown = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: false,
});

const standardHeadingTranslations = new Map([
  ['Summary', '概要'],
  ['Goal', '目標'],
  ['Task Contract', 'タスク契約'],
  ['Tasks', '作業項目'],
  ['Definition of Done', '完了条件'],
  ['Evidence To Fill Before Checking', '確認前に埋める証跡'],
  ['Discussion Seed', '議論のたたき台'],
  ['Current Draft Focus', '現在の下書きの焦点'],
  ['Provisional Agreement', '暫定合意'],
  ['Provisional Agreement On Expected Value', '期待価値に関する暫定合意'],
  ['Provisional Agreement On Operating Model', '運用モデルに関する暫定合意'],
  ['Provisional Agreement On One-Page Summary', '1ページ要約に関する暫定合意'],
  ['Evidence Mapping Table', '証跡対応表'],
  ['Task Mapping', '作業項目対応表'],
  ['Definition Of Done Mapping', '完了条件対応表'],
  ['Final Review Rule For Issue 1', 'Issue 1 最終レビュー規則'],
  ['Final Review Result', '最終レビュー結果'],
  ['Current Status', '現在の状態'],
  ['Dependencies', '依存関係'],
  ['Implementation Notes', '実装メモ'],
  ['Current Review Notes', '現在のレビュー観点'],
  ['Spot Check Evidence', 'スポットチェック証跡'],
  ['Process Review Notes', 'プロセスレビュー記録'],
]);

const labelTranslations = new Map([
  ['planning', '計画'],
  ['portal', 'portal'],
  ['aws', 'AWS'],
  ['gcp', 'GCP'],
  ['azure', 'Azure'],
  ['infrastructure', 'インフラ'],
  ['documentation', '文書化'],
  ['security', 'セキュリティ'],
  ['cicd', 'CI/CD'],
  ['frontend', 'フロントエンド'],
  ['backend', 'バックエンド'],
  ['testing', 'テスト'],
  ['monitoring', '監視'],
  ['sns', 'SNS'],
]);

const glossaryDictionary = [
  { term: 'fail-closed', ja: '安全側で失敗させる', note: '判定できない場合に成功扱いせず、明示的に停止または失敗として扱う設計方針。' },
  { term: 'baseline', ja: '基準線', note: '後続作業が参照する最小限の判断・実装・検証の出発点。' },
  { term: 'hardening', ja: '堅牢化', note: '既存機能を壊れにくくし、運用や検証の安全性を高める作業。' },
  { term: 'smoke path', ja: '最小確認経路', note: '主要な流れが最低限動くかを素早く確認するための経路。' },
  { term: 'route metadata', ja: 'ルートメタデータ', note: '画面遷移や公開経路に付随する定義情報。' },
  { term: 'major flow', ja: '主要フロー', note: '利用者や運用者が最初に通るべき中心的な操作の流れ。' },
  { term: 'staging', ja: 'ステージング', note: '本番前に動作や反映を確認するための検証環境。' },
  { term: 'production', ja: '本番環境', note: '実際の利用者に公開される運用環境。' },
  { term: 'operator', ja: '運用担当者', note: '監視、承認、非表示、切り戻しなどの運用行為を担う役割。' },
  { term: 'workflow', ja: 'ワークフロー', note: 'GitHub Actions などで定義された自動処理の流れ。' },
  { term: 'owner', ja: '責任者', note: '意思決定または更新責任を持つ担当者。文脈により product owner などを含む。' },
  { term: 'review', ja: 'レビュー', note: '内容や実装が要件を満たすか確認する工程。' },
  { term: 'evidence', ja: '証跡', note: '判断や完了状態の根拠になるログ、表、文書、出力結果。' },
  { term: 'mapping', ja: '対応付け', note: 'チェック項目とその根拠を結び付けて整理すること。' },
  { term: 'draft', ja: '下書き', note: 'まだ確定前だが議論やレビューの基礎として置かれた文書。' },
  { term: 'release', ja: 'リリース', note: '利用者に公開するまとまりとしての提供単位。' },
  { term: 'rollback', ja: 'ロールバック', note: '変更後の状態から以前の安定状態へ戻すこと。' },
  { term: 'close approval', ja: 'クローズ承認', note: 'Issue を完了扱いとして閉じてよいという明示承認。' },
  { term: 'current status', ja: '現在の状態', note: 'Issue 文書時点での完了度合いや同期状況を示す節。' },
  { term: 'definition of done', ja: '完了条件', note: 'その Issue を完了とみなすために満たすべき条件。' },
  { term: 'task contract', ja: 'タスク契約', note: '対象、目的、スコープ、検証計画、リスクを明文化した作業契約。' },
];

export function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function extractTitle(markdownText, fallbackTitle) {
  const heading = markdownText.match(/^#\s+(.+)$/m);
  return heading?.[1]?.trim() || fallbackTitle;
}

function formatLabels(labels = []) {
  if (!labels.length) {
    return '';
  }

  return labels
    .map((label) => {
      const translated = labelTranslations.get(label.name.toLowerCase()) || label.name;
      return `<span class="label-chip">${escapeHtml(translated)}</span>`;
    })
    .join('');
}

function localizeStandardHeadings(markdownText) {
  return markdownText.replace(/^(##+)\s+(.+)$/gm, (match, hashes, title) => {
    const translated = standardHeadingTranslations.get(title.trim());
    return translated ? `${hashes} ${translated}` : match;
  });
}

function collectGlossaryTerms(markdownText, title, labels = []) {
  const haystack = `${title}\n${markdownText}\n${labels.map((label) => label.name).join(' ')}`.toLowerCase();
  return glossaryDictionary.filter(({ term }) => haystack.includes(term.toLowerCase()));
}

function stripMarkdown(value) {
  return value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/^#+\s+/gm, '')
    .replace(/\|/g, ' ')
    .replace(/\*\*/g, '')
    .replace(/__/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseSections(markdownText) {
  const lines = markdownText.split(/\r?\n/);
  const sections = [];
  let current = { title: '', level: 1, lines: [] };

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);

    if (match && match[1].length === 2) {
      sections.push({
        title: current.title,
        level: current.level,
        content: current.lines.join('\n').trim(),
      });
      current = { title: match[2].trim(), level: 2, lines: [] };
      continue;
    }

    current.lines.push(line);
  }

  sections.push({
    title: current.title,
    level: current.level,
    content: current.lines.join('\n').trim(),
  });

  return sections.filter((section) => section.title || section.content);
}

function findSection(sections, candidates) {
  const normalizedCandidates = candidates.map((candidate) => candidate.toLowerCase());
  return sections.find((section) => normalizedCandidates.includes(section.title.toLowerCase()));
}

function extractListItems(markdownText) {
  return markdownText
    .split(/\r?\n/)
    .map((line) => line.match(/^[-*+]\s+(.*)$/)?.[1]?.trim())
    .filter(Boolean);
}

function buildChecklistSummary(markdownText) {
  const items = markdownText.match(/- \[[x ]\] .+/g) || [];
  const completed = items.filter((item) => item.includes('[x]')).length;

  if (!items.length) {
    return null;
  }

  return `${completed}/${items.length} 項目が完了済みとして記録されている。`;
}

function buildGuideOverview(markdownText) {
  const sections = parseSections(markdownText);
  const summary = findSection(sections, ['Summary']);
  const goal = findSection(sections, ['Goal']);
  const currentStatus = findSection(sections, ['Current Status']);
  const tasks = findSection(sections, ['Tasks']);
  const dod = findSection(sections, ['Definition of Done']);
  const dependencies = findSection(sections, ['Dependencies']);

  const summaryText = stripMarkdown(summary?.content || '');
  const goalText = stripMarkdown(goal?.content || '');
  const currentStatusItems = extractListItems(currentStatus?.content || '');
  const dependencyItems = extractListItems(dependencies?.content || '');
  const taskSummary = buildChecklistSummary(tasks?.content || '');
  const dodSummary = buildChecklistSummary(dod?.content || '');

  return {
    summary,
    goal,
    currentStatus,
    tasks,
    dod,
    dependencies,
    summaryText,
    goalText,
    currentStatusItems,
    dependencyItems,
    taskSummary,
    dodSummary,
  };
}

export function buildMarkdownPageHtml({
  title,
  markdownText,
  issueNumber,
  sourcePath,
  githubUrl,
  updatedAt,
  labels = [],
  intro,
}) {
  const guide = buildGuideOverview(markdownText);
  const glossaryTerms = collectGlossaryTerms(markdownText, title, labels);
  const renderedMarkdown = markdown.render(localizeStandardHeadings(markdownText));
  const metadataBits = [
    issueNumber ? `Issue #${issueNumber}` : null,
    updatedAt ? `更新: ${updatedAt}` : null,
    sourcePath ? `ソース: ${sourcePath}` : null,
  ].filter(Boolean);

  return `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      :root {
        --ink: #182132;
        --muted: #586275;
        --line: #cfd7e6;
        --panel: #f5f7fb;
        --accent: #0b6b6b;
        --accent-soft: rgba(11, 107, 107, 0.1);
      }

      @page {
        size: A4;
        margin: 15mm 14mm 16mm;
      }

      * {
        box-sizing: border-box;
      }

      html {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      body {
        margin: 0;
        color: var(--ink);
        font-family: "Noto Sans CJK JP", "Hiragino Sans", "Yu Gothic", sans-serif;
        line-height: 1.6;
        background:
          radial-gradient(circle at top right, rgba(11, 107, 107, 0.12) 0, rgba(11, 107, 107, 0) 26%),
          linear-gradient(180deg, #f8fbff 0%, #eef4fb 100%);
      }

      main {
        width: 100%;
      }

      .hero {
        padding: 15mm 14mm 11mm;
        border: 1px solid var(--line);
        border-radius: 18px;
        background: linear-gradient(160deg, var(--accent-soft), rgba(255, 255, 255, 0.97));
      }

      .eyebrow {
        margin: 0 0 8px;
        color: var(--accent);
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      h1 {
        margin: 0;
        font-family: "Noto Serif CJK JP", "Hiragino Mincho ProN", serif;
        font-size: 27px;
        line-height: 1.3;
      }

      .intro {
        margin: 12px 0 0;
        color: var(--muted);
        font-size: 13px;
      }

      .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 12px;
        margin-top: 14px;
        color: var(--muted);
        font-size: 11px;
      }

      .labels {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 12px;
      }

      .meta-grid,
      .card-grid {
        display: grid;
        gap: 12px;
      }

      .meta-grid {
        margin-top: 16px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .card-grid {
        margin-top: 10mm;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .glossary-table {
        margin-top: 12px;
      }

      .meta-card,
      .card,
      .note,
      .warning {
        border: 1px solid var(--line);
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.94);
      }

      .meta-card,
      .card {
        padding: 14px 16px;
      }

      .meta-card strong,
      .card strong,
      .note strong,
      .warning strong {
        display: block;
        margin-bottom: 6px;
        color: var(--accent);
        font-size: 12px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }

      .guide-section {
        margin-top: 10mm;
        page-break-inside: auto;
      }

      .section-lead {
        margin-bottom: 8px;
        color: var(--muted);
      }

      .inline-summary {
        margin-top: 10px;
        padding: 11px 13px;
        border-left: 4px solid var(--accent);
        border-radius: 0 12px 12px 0;
        background: rgba(11, 107, 107, 0.08);
      }

      .note,
      .warning {
        margin-top: 12px;
        padding: 14px 16px;
      }

      .warning {
        background: linear-gradient(180deg, rgba(255, 241, 214, 0.92), rgba(255, 255, 255, 0.96));
        color: #865200;
      }

      .label-chip {
        display: inline-flex;
        align-items: center;
        padding: 4px 8px;
        border: 1px solid var(--line);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.92);
        color: var(--accent);
        font-size: 11px;
      }

      .doc {
        margin-top: 9mm;
        padding: 0 2mm;
      }

      .source-block {
        margin-top: 12mm;
        padding-top: 6mm;
        border-top: 2px solid var(--line);
      }

      .doc > :first-child {
        margin-top: 0;
      }

      h2,
      h3,
      h4 {
        break-after: avoid-page;
        page-break-after: avoid;
      }

      h2 {
        margin: 0 0 10px;
        padding-bottom: 6px;
        border-bottom: 2px solid var(--line);
        font-family: "Noto Serif CJK JP", "Hiragino Mincho ProN", serif;
        font-size: 20px;
      }

      h3 {
        margin: 18px 0 8px;
        font-size: 16px;
      }

      p,
      li,
      td,
      th,
      blockquote {
        font-size: 12px;
      }

      p {
        margin: 0 0 10px;
      }

      ul,
      ol {
        margin: 0 0 10px;
        padding-left: 22px;
      }

      li + li {
        margin-top: 5px;
      }

      a {
        color: var(--accent);
        text-decoration: none;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        margin: 12px 0;
        background: rgba(255, 255, 255, 0.92);
      }

      th,
      td {
        padding: 8px 9px;
        border: 1px solid var(--line);
        text-align: left;
        vertical-align: top;
        word-break: break-word;
      }

      th {
        background: var(--panel);
      }

      tr,
      thead,
      blockquote,
      pre,
      code {
        page-break-inside: avoid;
        break-inside: avoid;
      }

      blockquote {
        margin: 12px 0;
        padding: 10px 12px;
        border-left: 4px solid var(--accent);
        background: rgba(11, 107, 107, 0.06);
      }

      pre {
        margin: 12px 0;
        padding: 12px 14px;
        border: 1px solid var(--line);
        border-radius: 12px;
        background: #f8fbff;
        overflow: hidden;
        white-space: pre-wrap;
        word-break: break-word;
      }

      code {
        font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
        font-size: 11px;
      }

      hr {
        margin: 18px 0;
        border: 0;
        border-top: 1px solid var(--line);
      }

      @media print {
        body {
          background: #fff;
        }

        .meta-grid,
        .card-grid,
        .meta-card,
        .card,
        .note,
        .warning,
        table {
          box-shadow: none;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <section class="hero">
        <p class="eyebrow">Issue 日本語解説資料</p>
        <h1>${escapeHtml(title)}</h1>
        <p class="intro">${escapeHtml(intro || 'この資料は closed Issue の原文を、そのまま読むだけでなく、要点と完了状態を素早く把握できるように説明用へ再構成した解説書である。判断の要旨を先に示し、その後ろに原文全体を付けている。')}</p>
        ${metadataBits.length ? `<div class="meta">${metadataBits.map((bit) => `<span>${escapeHtml(bit)}</span>`).join('')}</div>` : ''}
        ${githubUrl ? `<div class="meta"><span>GitHub: ${escapeHtml(githubUrl)}</span></div>` : ''}
        ${labels.length ? `<div class="labels">${formatLabels(labels)}</div>` : ''}
        <div class="meta-grid">
          <div class="meta-card">
            <strong>この Issue の要点</strong>
            ${escapeHtml(guide.summaryText || '原文内の Summary を起点に判断背景を整理する Issue。')}
          </div>
          <div class="meta-card">
            <strong>目標</strong>
            ${escapeHtml(guide.goalText || '原文内の Goal と Current Status をもとに、何を達成済みとして扱うかを確認する。')}
          </div>
          <div class="meta-card">
            <strong>完了状態</strong>
            ${escapeHtml(guide.currentStatusItems[0] || 'closed Issue として記録されている原文を参照する。')}
          </div>
        </div>
      </section>
      <section class="guide-section">
        <h2>1. この Issue が扱っていたこと</h2>
        <p class="section-lead">まず Summary と Goal から、この Issue が何を決めるためのものだったかを短く押さえる。</p>
        ${guide.summary?.content ? markdown.render(guide.summary.content) : '<p>Summary が明示されていないため、原文全体を参照する。</p>'}
        ${guide.goal?.content ? `<div class="note"><strong>目標</strong>${markdown.render(guide.goal.content)}</div>` : ''}
      </section>
      <section class="guide-section">
        <h2>2. 完了判断の見方</h2>
        <p class="section-lead">Tasks、Definition of Done、Current Status の記述から、どこまで完了済みとして扱っているかを先に読む。</p>
        <div class="card-grid">
          <div class="card">
            <strong>Tasks</strong>
            <p>${escapeHtml(guide.taskSummary || 'Tasks セクションの有無は原文側で確認する。')}</p>
          </div>
          <div class="card">
            <strong>Definition of Done</strong>
            <p>${escapeHtml(guide.dodSummary || 'Definition of Done セクションの有無は原文側で確認する。')}</p>
          </div>
        </div>
        ${guide.currentStatusItems.length ? `<div class="inline-summary">${escapeHtml(guide.currentStatusItems.join(' / '))}</div>` : '<div class="inline-summary">Current Status の明示箇所が少ないため、原文の末尾セクションを直接確認する。</div>'}
      </section>
      <section class="guide-section">
        <h2>3. 依存関係と読み進め方</h2>
        <p class="section-lead">Dependencies や前提 Issue がある場合は、ここで関連先を先に把握しておくと読みやすい。</p>
        ${guide.dependencyItems.length ? `<div class="note"><strong>依存関係</strong><ul>${guide.dependencyItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div>` : '<div class="note"><strong>依存関係</strong><p>Dependencies セクションに明示された依存は少ないか、原文中の別セクションへ分散している。</p></div>'}
        <div class="warning">
          <strong>読み方の注意</strong>
          <p>この解説書は原文の意思決定や完了状態を読みやすくするための補助資料である。最終的な正本は原文 Issue にあり、判断変更時は原文側を先に更新する。</p>
        </div>
      </section>
      ${glossaryTerms.length ? `<section class="guide-section"><h2>4. 用語集</h2><p class="section-lead">原文に残る英語や実務用語のうち、訳し切らずに補助説明を付けた方が読みやすい語をここにまとめる。</p><table class="glossary-table"><thead><tr><th>原語</th><th>日本語の扱い</th><th>補足</th></tr></thead><tbody>${glossaryTerms.map(({ term, ja, note }) => `<tr><td>${escapeHtml(term)}</td><td>${escapeHtml(ja)}</td><td>${escapeHtml(note)}</td></tr>`).join('')}</tbody></table></section>` : ''}
      <section class="guide-section source-block">
        <h2>${glossaryTerms.length ? '5' : '4'}. 原文</h2>
        <p class="section-lead">以下に Issue 原文をそのまま掲載する。詳細な根拠、証跡、チェックリストはこの原文を参照する。</p>
      <article class="doc markdown-body">${renderedMarkdown}</article>
      </section>
    </main>
  </body>
</html>`;
}

export async function renderHtmlToPdf({ html, outputPath, headerTitle }) {
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({
      viewport: {
        width: 1440,
        height: 2048,
      },
    });

    await page.setContent(html, { waitUntil: 'load' });
    await page.emulateMedia({ media: 'print' });
    await page.pdf({
      path: outputPath,
      format: 'A4',
      preferCSSPageSize: true,
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `<div style="width:100%;padding:0 10mm;font-size:8px;color:#5b6578;font-family:sans-serif;">${escapeHtml(headerTitle)}</div>`,
      footerTemplate:
        '<div style="width:100%;padding:0 10mm;font-size:8px;color:#5b6578;font-family:sans-serif;display:flex;justify-content:space-between;"><span>MultiCloudProject closed issues</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
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
}

export async function renderMarkdownFileToPdf({
  inputPath,
  outputPath,
  title,
  issueNumber,
  sourcePath,
  githubUrl,
  updatedAt,
  labels,
  intro,
}) {
  const markdownText = await fs.readFile(inputPath, 'utf8');
  const resolvedTitle = title || extractTitle(markdownText, path.basename(inputPath, path.extname(inputPath)));
  const html = buildMarkdownPageHtml({
    title: resolvedTitle,
    markdownText,
    issueNumber,
    sourcePath,
    githubUrl,
    updatedAt,
    labels,
    intro,
  });

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await renderHtmlToPdf({
    html,
    outputPath,
    headerTitle: resolvedTitle,
  });
}

async function main() {
  const [, , inputArg, outputArg, ...titleParts] = process.argv;

  if (!inputArg || !outputArg) {
    console.error('Usage: node ./scripts/render-markdown-to-pdf.mjs <input-md> <output-pdf> [title]');
    process.exit(1);
  }

  const inputPath = path.resolve(process.cwd(), inputArg);
  const outputPath = path.resolve(process.cwd(), outputArg);
  const title = titleParts.length ? titleParts.join(' ') : undefined;

  await renderMarkdownFileToPdf({
    inputPath,
    outputPath,
    title,
    sourcePath: path.relative(path.resolve(process.cwd(), '../..'), inputPath),
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await main();
}