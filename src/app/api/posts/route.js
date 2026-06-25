import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { decryptSession } from '@/lib/auth';

// Helper untuk validasi session admin
async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('berseni_session')?.value;
  const session = decryptSession(token);
  if (!session || session.role !== 'admin') return false;

  const activeSessionId = await db.get('admin_session_id');
  return session.sessionId === activeSessionId;
}

// GET: Mengambil semua postingan blog
export async function GET() {
  try {
    const posts = await db.get('posts') || [];
    
    // Sort posts descending by date (DD/MM/YYYY)
    const parseBlogDate = (dateStr) => {
      if (!dateStr) return new Date(0);
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
      return new Date(dateStr);
    };
    
    const sortedPosts = [...posts].sort((a, b) => parseBlogDate(b.date) - parseBlogDate(a.date));
    
    return NextResponse.json(sortedPosts);
  } catch (err) {
    console.error("GET posts error:", err);
    return NextResponse.json({ error: 'Gagal mengambil daftar artikel' }, { status: 500 });
  }
}

// POST: Menambahkan artikel blog baru (hanya admin)
export async function POST(request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { 
      slug, title_id, title_en, date, image, 
      excerpt_id, excerpt_en, content_id, content_en,
      seoTitle_id, seoTitle_en, seoDescription_id, seoDescription_en, seoKeywords_id, seoKeywords_en,
      ctaShow, ctaTitle_id, ctaTitle_en, ctaDesc_id, ctaDesc_en, ctaShowButton, ctaButtonText_id, ctaButtonText_en, ctaButtonLink
    } = body;
    
    if (!slug || !title_id || !title_en || !content_id || !content_en) {
      return NextResponse.json({ error: 'Slug, judul (ID & EN), dan konten (ID & EN) wajib diisi!' }, { status: 400 });
    }
    
    const posts = await db.get('posts') || [];
    
    // Periksa apakah slug sudah terdaftar
    if (posts.some(p => p.slug === slug)) {
      return NextResponse.json({ error: 'Slug artikel ini sudah digunakan, buat slug yang unik!' }, { status: 400 });
    }
    
    const newPost = {
      slug,
      title_id,
      title_en,
      date: date || new Date().toLocaleDateString('id-ID'),
      image: image || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop',
      excerpt_id: excerpt_id || '',
      excerpt_en: excerpt_en || '',
      content_id: content_id || '',
      content_en: content_en || '',
      // SEO / GEO meta tags khusus untuk artikel blog ini
      seoTitle_id: seoTitle_id || '',
      seoTitle_en: seoTitle_en || '',
      seoDescription_id: seoDescription_id || '',
      seoDescription_en: seoDescription_en || '',
      seoKeywords_id: seoKeywords_id || '',
      seoKeywords_en: seoKeywords_en || '',
      // CTA configs
      ctaShow: !!ctaShow,
      ctaTitle_id: ctaTitle_id || '',
      ctaTitle_en: ctaTitle_en || '',
      ctaDesc_id: ctaDesc_id || '',
      ctaDesc_en: ctaDesc_en || '',
      ctaShowButton: !!ctaShowButton,
      ctaButtonText_id: ctaButtonText_id || '',
      ctaButtonText_en: ctaButtonText_en || '',
      ctaButtonLink: ctaButtonLink || ''
    };
    
    posts.unshift(newPost); // Taruh di awal biar langsung muncul sebagai artikel utama/terbaru
    const success = await db.set('posts', posts);
    
    if (success) {
      return NextResponse.json({ success: true, post: newPost });
    }
    return NextResponse.json({ error: 'Gagal menulis ke database' }, { status: 500 });
  } catch (err) {
    console.error("POST post error:", err);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

// PUT: Memperbarui artikel blog yang ada (hanya admin)
export async function PUT(request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { 
      originalSlug, slug, title_id, title_en, date, image, 
      excerpt_id, excerpt_en, content_id, content_en,
      seoTitle_id, seoTitle_en, seoDescription_id, seoDescription_en, seoKeywords_id, seoKeywords_en,
      ctaShow, ctaTitle_id, ctaTitle_en, ctaDesc_id, ctaDesc_en, ctaShowButton, ctaButtonText_id, ctaButtonText_en, ctaButtonLink
    } = body;
    
    if (!originalSlug || !slug || !title_id || !title_en || !content_id || !content_en) {
      return NextResponse.json({ error: 'Parameter edit tidak lengkap!' }, { status: 400 });
    }
    
    let posts = await db.get('posts') || [];
    const index = posts.findIndex(p => p.slug === originalSlug);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 });
    }
    
    // Periksa keunikan slug baru jika berubah
    if (slug !== originalSlug && posts.some(p => p.slug === slug)) {
      return NextResponse.json({ error: 'Slug artikel ini sudah digunakan oleh artikel lain!' }, { status: 400 });
    }
    
    posts[index] = {
      ...posts[index],
      slug,
      title_id,
      title_en,
      date: date || posts[index].date,
      image: image || posts[index].image,
      excerpt_id: excerpt_id || '',
      excerpt_en: excerpt_en || '',
      content_id: content_id || '',
      content_en: content_en || '',
      seoTitle_id: seoTitle_id || '',
      seoTitle_en: seoTitle_en || '',
      seoDescription_id: seoDescription_id || '',
      seoDescription_en: seoDescription_en || '',
      seoKeywords_id: seoKeywords_id || '',
      seoKeywords_en: seoKeywords_en || '',
      // CTA configs
      ctaShow: !!ctaShow,
      ctaTitle_id: ctaTitle_id || '',
      ctaTitle_en: ctaTitle_en || '',
      ctaDesc_id: ctaDesc_id || '',
      ctaDesc_en: ctaDesc_en || '',
      ctaShowButton: !!ctaShowButton,
      ctaButtonText_id: ctaButtonText_id || '',
      ctaButtonText_en: ctaButtonText_en || '',
      ctaButtonLink: ctaButtonLink || ''
    };
    
    const success = await db.set('posts', posts);
    if (success) {
      return NextResponse.json({ success: true, post: posts[index] });
    }
    return NextResponse.json({ error: 'Gagal menulis ke database' }, { status: 500 });
  } catch (err) {
    console.error("PUT post error:", err);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

// DELETE: Menghapus artikel blog (hanya admin)
export async function DELETE(request) {
  try {
    if (!(await isAdmin())) {
      console.log("DELETE post: Unauthorized access attempt");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    console.log("DELETE post - Received slug:", slug);
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug artikel wajib disertakan' }, { status: 400 });
    }
    
    let posts = await db.get('posts') || [];
    console.log("DELETE post - Existing slugs:", posts.map(p => p.slug));
    const filteredPosts = posts.filter(p => p.slug !== slug);
    console.log("DELETE post - Remaining count:", filteredPosts.length);
    
    if (posts.length === filteredPosts.length) {
      console.log("DELETE post - Slug not found in list:", slug);
      return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 });
    }
    
    const success = await db.set('posts', filteredPosts);
    console.log("DELETE post - Write status:", success);
    if (success) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Gagal menulis ke database' }, { status: 500 });
  } catch (err) {
    console.error("DELETE post error:", err);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
