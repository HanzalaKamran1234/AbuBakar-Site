import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getSupabaseAdminClient, isSupabaseConfigured } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const file = (formData.get('file') as File) || files[0];

    const allFiles = files.length > 0 ? files : file ? [file] : [];

    if (allFiles.length === 0) {
      return NextResponse.json({ error: 'No image files provided.' }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    for (const item of allFiles) {
      if (!item || !(item instanceof File)) continue;

      // Validate MIME type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif', 'image/avif'];
      if (!validTypes.includes(item.type)) {
        return NextResponse.json(
          { error: `File "${item.name}" has an unsupported format (${item.type}). Please upload JPEG, PNG, or WebP.` },
          { status: 400 }
        );
      }

      // Validate size (10MB)
      if (item.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: `File "${item.name}" exceeds the maximum 10MB size limit.` },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await item.arrayBuffer());
      const ext = item.name.split('.').pop() || 'jpg';
      const cleanFileName = `ab-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

      const supabase = getSupabaseAdminClient();
      if (supabase && isSupabaseConfigured()) {
        try {
          const { error: uploadErr } = await supabase.storage
            .from('product-images')
            .upload(cleanFileName, buffer, {
              contentType: item.type,
              upsert: true,
            });

          if (!uploadErr) {
            const { data } = supabase.storage.from('product-images').getPublicUrl(cleanFileName);
            if (data?.publicUrl) {
              uploadedUrls.push(data.publicUrl);
              continue;
            }
          } else {
            console.warn('Supabase storage upload failed, using local/data URI fallback:', uploadErr);
          }
        } catch (sErr) {
          console.warn('Supabase storage exception, falling back:', sErr);
        }
      }

      // Local / serverless fallback
      try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const targetPath = path.join(uploadDir, cleanFileName);
        fs.writeFileSync(targetPath, buffer);
        uploadedUrls.push(`/uploads/${cleanFileName}`);
      } catch (fsErr) {
        // Fallback for read-only serverless environment: Base64 data URI
        const base64 = buffer.toString('base64');
        const dataUri = `data:${item.type};base64,${base64}`;
        uploadedUrls.push(dataUri);
      }
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json({ error: 'Failed to process images.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      url: uploadedUrls[0],
      urls: uploadedUrls,
    });
  } catch (err: any) {
    console.error('Image upload error:', err);
    return NextResponse.json({ error: 'Image upload failed: ' + err.message }, { status: 500 });
  }
}
