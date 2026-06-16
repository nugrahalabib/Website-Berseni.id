import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { decryptSession } from '@/lib/auth';

// Helper untuk validasi session admin
async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('berseni_session')?.value;
  const session = decryptSession(token);
  return session && session.role === 'admin';
}

// GET: Mengambil semua produk untuk landing page
export async function GET() {
  try {
    const products = await db.get('products') || [];
    return NextResponse.json(products);
  } catch (err) {
    console.error("GET products error:", err);
    return NextResponse.json({ error: 'Gagal mengambil daftar produk' }, { status: 500 });
  }
}

// POST: Menambahkan produk baru (hanya admin)
export async function POST(request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { title_id, title_en, category, price, image, description_id, description_en, specs_id, specs_en, link } = body;
    
    if (!title_id || !title_en || !category || !link) {
      return NextResponse.json({ error: 'Nama (ID & EN), kategori, dan link shopee/lynk harus diisi!' }, { status: 400 });
    }
    
    const products = await db.get('products') || [];
    
    const newProduct = {
      id: `prod-${Date.now()}`,
      title_id,
      title_en,
      category,
      price: Number(price) || 0,
      image: image || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop', // Fallback image
      description_id: description_id || '',
      description_en: description_en || '',
      specs_id: specs_id || '',
      specs_en: specs_en || '',
      link
    };
    
    products.push(newProduct);
    const success = await db.set('products', products);
    
    if (success) {
      return NextResponse.json({ success: true, product: newProduct });
    }
    return NextResponse.json({ error: 'Gagal menulis ke database' }, { status: 500 });
  } catch (err) {
    console.error("POST product error:", err);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

// PUT: Memperbarui produk yang sudah ada (hanya admin)
export async function PUT(request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { id, title_id, title_en, category, price, image, description_id, description_en, specs_id, specs_en, link } = body;
    
    if (!id || !title_id || !title_en || !category || !link) {
      return NextResponse.json({ error: 'Data edit tidak lengkap (ID, nama ID & EN, kategori, link wajib ada)' }, { status: 400 });
    }
    
    let products = await db.get('products') || [];
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }
    
    products[index] = {
      ...products[index],
      title_id,
      title_en,
      category,
      price: Number(price) || 0,
      image: image || products[index].image,
      description_id: description_id || '',
      description_en: description_en || '',
      specs_id: specs_id || '',
      specs_en: specs_en || '',
      link
    };
    
    const success = await db.set('products', products);
    if (success) {
      return NextResponse.json({ success: true, product: products[index] });
    }
    return NextResponse.json({ error: 'Gagal menulis ke database' }, { status: 500 });
  } catch (err) {
    console.error("PUT product error:", err);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

// DELETE: Menghapus produk (hanya admin)
export async function DELETE(request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID produk tidak disertakan' }, { status: 400 });
    }
    
    let products = await db.get('products') || [];
    const filteredProducts = products.filter(p => p.id !== id);
    
    if (products.length === filteredProducts.length) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }
    
    const success = await db.set('products', filteredProducts);
    if (success) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Gagal menulis ke database' }, { status: 500 });
  } catch (err) {
    console.error("DELETE product error:", err);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
