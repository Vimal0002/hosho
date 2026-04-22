import { getInventory, getProductById } from '@/lib/data';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const id = searchParams.get('id');
    const search = searchParams.get('search');

    // Single product by ID
    if (id) {
      const product = getProductById(id);
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json(product);
    }

    let products = getInventory();

    // Filter by category
    if (category) {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Search
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      );
    }

    // Get unique categories
    const categories = [...new Set(products.map(p => p.category))];

    return NextResponse.json({
      products,
      categories,
      total: products.length
    });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
