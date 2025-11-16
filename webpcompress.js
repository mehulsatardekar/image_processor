import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.join(__dirname, "input_imgs");
const OUTPUT_DIR = path.join(__dirname, "output_imgs");

async function compressFile(filePath) {
  const fileBuffer = await fs.readFile(filePath);
  const filename = path.basename(filePath);
  const ext = path.extname(filename).toLowerCase();

  const baseName = path.basename(filename, ext);
  const outFilename = `${baseName}.webp`;

  const compressedBuffer = await sharp(fileBuffer)
    .webp({ quality: 60 })
    .toBuffer();

  const outPath = path.join(OUTPUT_DIR, outFilename);
  await fs.writeFile(outPath, compressedBuffer);

  const saved = fileBuffer.length - compressedBuffer.length;
  console.log("Compressed:", filename, "->", outPath, "| saved bytes:", saved);
}

async function run() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const files = await fs.readdir(INPUT_DIR);

  for (const file of files) {
    if (!file.match(/\.(webp|png|jpe?g)$/i)) continue;
    await compressFile(path.join(INPUT_DIR, file));
  }
}

run().catch(console.error);
