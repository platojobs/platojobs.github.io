#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

const IGNORED_LABELS = new Set(["TODO", "Friends"]);

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    const next = argv[i + 1];
    if (token.startsWith("--") && next) {
      args[token.slice(2)] = next;
      i += 1;
    }
  }
  return args;
}

function slugify(value) {
  const ascii = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");

  return ascii || "post";
}

function stripMarkdown(value) {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/[*_~]/g, "")
    .replace(/\r/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readingTimeFromText(text) {
  const length = stripMarkdown(text).length;
  return Math.max(1, Math.round(length / 500));
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function readMetadata(metaPath) {
  const raw = await fs.readFile(metaPath, "utf8");
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

async function cleanDir(dir) {
  await fs.rm(dir, { recursive: true, force: true });
  await ensureDir(dir);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const outDir = path.resolve(args.out || ".");
  const sourceDir = path.resolve(args.source || "../SFLOG");
  const metaPath = path.resolve(args.meta || "./sflog-issues.jsonl");
  const backupDir = path.join(sourceDir, "BACKUP");
  const contentDir = path.join(outDir, "blog-content");
  const dataDir = path.join(outDir, "blog-data");

  const metadata = await readMetadata(metaPath);
  const metaMap = new Map(metadata.map((item) => [String(item.number), item]));
  const files = await fs.readdir(backupDir);

  await cleanDir(contentDir);
  await cleanDir(dataDir);

  const posts = [];
  const seenNumbers = new Set();

  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    const match = file.match(/^(\d+)_/);
    if (!match) continue;

    const issueNumber = match[1];
    if (seenNumbers.has(issueNumber)) continue;
    const issueMeta = metaMap.get(issueNumber);
    if (!issueMeta) continue;

    const filePath = path.join(backupDir, file);
    let markdown = await fs.readFile(filePath, "utf8");
    markdown = markdown.replace(/^#\s+\[[^\]]+\]\([^)]+\)\s*/m, "").trim();

    const title = issueMeta.title || file.replace(/^\d+_/, "").replace(/\.md$/, "");
    const slug = `${issueNumber}-${slugify(title)}`;
    const excerpt = stripMarkdown(markdown).slice(0, 180) || title;
    const labels = Array.isArray(issueMeta.labels)
      ? issueMeta.labels.filter((label) => label && !IGNORED_LABELS.has(label))
      : [];
    const post = {
      number: Number(issueNumber),
      title,
      slug,
      createdAt: issueMeta.created_at,
      updatedAt: issueMeta.updated_at,
      issueUrl: issueMeta.html_url,
      labels,
      excerpt,
      readingTime: readingTimeFromText(markdown)
    };

    posts.push(post);
    seenNumbers.add(issueNumber);
    await fs.writeFile(path.join(contentDir, `${slug}.md`), markdown + "\n", "utf8");
  }

  posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  await fs.writeFile(
    path.join(dataDir, "posts.json"),
    JSON.stringify(posts, null, 2) + "\n",
    "utf8"
  );

  console.log(`Generated ${posts.length} posts.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
