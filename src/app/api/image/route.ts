import { NextResponse } from 'next/server';
import { BRAND_COLORS, CATEGORY_EMOJIS, type ProductCategory } from '@/lib/indian-products';

// Generate a branded SVG placeholder as a data URI
function generateBrandPlaceholder(brand: string, category?: string): string {
  const color = BRAND_COLORS[brand] || '#f7ac32';
  const emoji = category ? CATEGORY_EMOJIS[category as ProductCategory] || '📦' : '📦';
  
  // Create a simple branded SVG
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color};stop-opacity:0.15"/>
        <stop offset="100%" style="stop-color:${color};stop-opacity:0.05"/>
      </linearGradient>
    </defs>
    <rect width="400" height="400" fill="url(#bg)"/>
    <text x="200" y="180" text-anchor="middle" font-size="80">${emoji}</text>
    <text x="200" y="260" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="28" fill="${color}" opacity="0.6">${brand.toUpperCase()}</text>
  </svg>`;
  
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const brand = searchParams.get('brand') || '';
  const category = searchParams.get('category') || '';

  if (!query) {
    return NextResponse.json({ imageUrl: null });
  }

  // Try Open Food Facts API first (free, reliable, has real product images)
  try {
    const offUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=3&fields=product_name,image_front_url,image_url`;
    
    const response = await fetch(offUrl, { 
      signal: AbortSignal.timeout(4000),
      headers: { 'User-Agent': 'PurePlate/1.0 (contact@pureplate.in)' }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.products && data.products.length > 0) {
        for (const product of data.products) {
          const imgUrl = product.image_front_url || product.image_url;
          if (imgUrl && imgUrl.startsWith('http')) {
            return NextResponse.json({ imageUrl: imgUrl });
          }
        }
      }
    }
  } catch {
    // Open Food Facts failed, fall through to placeholder
  }

  // Generate branded placeholder
  const placeholder = generateBrandPlaceholder(brand || query.split(' ')[0], category);
  return NextResponse.json({ imageUrl: placeholder });
}
