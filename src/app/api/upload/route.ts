import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    // Preserve the original filename and Korean characters
    const filename = `${Date.now()}_${file.name}`;
    
    try {
      // Attempt to upload to Vercel Blob
      const blob = await put(filename, file, {
        access: 'public',
      });
      return NextResponse.json({ success: true, url: blob.url });
    } catch (blobError: any) {
      console.warn('Vercel Blob failed, falling back to local filesystem:', blobError.message);
      
      // Fallback to local filesystem for local testing without Vercel Tokens
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });
      
      const filePath = path.join(uploadDir, filename);
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);
      
      return NextResponse.json({ success: true, url: `/uploads/${filename}` });
    }
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to upload file' }, { status: 500 });
  }
}
