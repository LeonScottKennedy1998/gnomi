import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { contentSchema, type Content } from "./contentSchema";
import { prisma } from "./prisma";

const dataPath = path.resolve(__dirname, "..", "..", "data", "content.json");

function isEmptyObject(value: unknown): boolean {
  if (!value) return false;
  if (typeof value === "string") return value.trim() === "";
  if (typeof value !== "object" || Array.isArray(value)) return false;
  return Object.keys(value as Record<string, unknown>).length === 0;
}

function parseContentPayload(payload: unknown): Content {
  if (typeof payload === "string") {
    const parsed = JSON.parse(payload);
    return contentSchema.parse(parsed);
  }
  return contentSchema.parse(payload);
}

export async function readContentFile(): Promise<Content> {
  const raw = await fsPromises.readFile(dataPath, "utf8");
  const parsed = JSON.parse(raw);
  return contentSchema.parse(parsed);
}

export async function ensureContentInitialized(): Promise<Content> {
  const row = await prisma.content.findUnique({ where: { id: 1 } });
  if (!row || isEmptyObject(row.data)) {
    const content = await readContentFile();
    await prisma.content.upsert({
      where: { id: 1 },
      create: { id: 1, data: JSON.stringify(content) },
      update: { data: JSON.stringify(content) }
    });
    return content;
  }

  return parseContentPayload(row.data);
}

export async function getContent(): Promise<Content> {
  const row = await prisma.content.findUnique({ where: { id: 1 } });
  if (row && row.data && !isEmptyObject(row.data)) {
    return parseContentPayload(row.data);
  }

  return ensureContentInitialized();
}

export async function saveContent(content: Content): Promise<void> {
  const validated = contentSchema.parse(content);
  const payload = JSON.stringify(validated);

  await prisma.content.upsert({
    where: { id: 1 },
    create: { id: 1, data: payload },
    update: { data: payload }
  });

  await fsPromises.mkdir(path.dirname(dataPath), { recursive: true });
  await fsPromises.writeFile(dataPath, JSON.stringify(validated, null, 2), "utf8");
}

export async function saveContentSection<K extends keyof Content>(key: K, value: Content[K]): Promise<Content> {
  const content = await getContent();
  const updated = { ...content, [key]: value } as Content;
  await saveContent(updated);
  return updated;
}

export function uploadsDir(): string {
  return path.resolve(__dirname, "..", "..", "public", "uploads");
}

export function publicDir(): string {
  return path.resolve(__dirname, "..", "..", "public");
}

export function adminDistDir(): string {
  return path.resolve(__dirname, "..", "..", "admin", "dist");
}

export function hasAdminDist(): boolean {
  const dist = adminDistDir();
  return fs.existsSync(dist);
}
