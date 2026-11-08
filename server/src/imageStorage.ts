import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// Get current file and dir path
const __fileName = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__fileName);

// get public and image dir paths
const PUBLIC_DIR = path.join(__dirName, '..', 'public');
const IMAGE_DIR = path.join(PUBLIC_DIR, 'images');

// Ensure images dir exists
if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR, { recursive: true });
    console.log('Created Image Dir', IMAGE_DIR);
}

function generateFilename(prefix = 'image') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}-${timestamp}-${random}`;
}

export function saveBase64Image(base64Data: string, prefix: string = 'image') {
    // strip the data url prefix if present
    const base64 = base64Data.replace(/^data:image\/\w+;base64,/, '');

    // generate unique name
    const fileName = `${generateFilename(prefix)}.png`;
    const filePath = path.join(IMAGE_DIR, fileName);

    // convetr base64 to binary buffer and write to file
    const buffer = Buffer.from(base64, 'base64');
    fs.writeFileSync(filePath, buffer);

    console.log(`[Imagestorage] saved image ${fileName} ${(buffer.length / 1024).toFixed(2)} kb`);
    return `/images/${fileName}`;
}