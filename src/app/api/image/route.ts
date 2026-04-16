import { NextResponse } from 'next/server';

// Brand-specific colors for rich gradient placeholders
const BRAND_PALETTE: Record<string, [string, string]> = {
  "Maggi": ["#E31837", "#FF6B6B"],
  "Nestle": ["#003DA5", "#4A90D9"],
  "Lay's": ["#C8102E", "#FFD700"],
  "Bingo": ["#FF6600", "#FFB347"],
  "Kurkure": ["#FF8C00", "#FFA94D"],
  "Haldiram's": ["#8B0000", "#CD5C5C"],
  "Parle": ["#DAA520", "#FFD700"],
  "Britannia": ["#1E3A5F", "#4682B4"],
  "Sunfeast": ["#D4001A", "#FF4444"],
  "Cadbury": ["#4B0082", "#8A2BE2"],
  "Mondelez": ["#4B0082", "#6A5ACD"],
  "Oreo": ["#1A1A2E", "#16213E"],
  "Coca-Cola": ["#E31837", "#C41E3A"],
  "Pepsi": ["#004B93", "#1E90FF"],
  "PepsiCo": ["#004B93", "#1E90FF"],
  "Thums Up": ["#C41E3A", "#E31837"],
  "Amul": ["#DAA520", "#F4C430"],
  "Mother Dairy": ["#006400", "#228B22"],
  "Dabur": ["#006400", "#32CD32"],
  "Patanjali": ["#E65100", "#FF8C00"],
  "Fortune": ["#003DA5", "#1E90FF"],
  "Saffola": ["#008000", "#32CD32"],
  "MDH": ["#E31837", "#FF4444"],
  "Everest": ["#E31837", "#FF6347"],
  "MTR": ["#DAA520", "#FFD700"],
  "Kissan": ["#E31837", "#FF6347"],
  "Kellogg's": ["#E31837", "#FF4444"],
  "Quaker": ["#003DA5", "#4169E1"],
  "Frooti": ["#DAA520", "#FFD700"],
  "Paper Boat": ["#006400", "#3CB371"],
  "Bournvita": ["#4B0082", "#663399"],
  "Horlicks": ["#E65100", "#FF8C00"],
  "KitKat": ["#E31837", "#FF4444"],
  "Uncle Chipps": ["#FF6600", "#FFA07A"],
  "Act II": ["#E31837", "#CD5C5C"],
  "Bikano": ["#8B0000", "#B22222"],
  "Priya": ["#E31837", "#FF4500"],
  "Aashirvaad": ["#003366", "#4682B4"],
  "Maaza": ["#DAA520", "#FFD700"],
  "Real": ["#228B22", "#32CD32"],
  "Tropicana": ["#FF8C00", "#FFA500"],
  "Complan": ["#003DA5", "#4169E1"],
  "Veeba": ["#E31837", "#FF6347"],
  "Funfoods": ["#DAA520", "#FFD700"],
  "Kwality Wall's": ["#003DA5", "#4682B4"],
  "Ferrero": ["#8B4513", "#D2691E"],
  "Sunfeast Yippee": ["#D4001A", "#FF4444"],
  "Top Ramen": ["#E31837", "#FF6347"],
  "Ching's Secret": ["#8B0000", "#DC143C"],
  "Knorr": ["#006400", "#228B22"],
  "Rasna": ["#FF8C00", "#FFD700"],
  "Bru": ["#4B0082", "#8B4513"],
  "Sundrop": ["#FFD700", "#FFA500"],
  "Lijjat": ["#DAA520", "#CD853F"],
  "Too Yumm!": ["#32CD32", "#228B22"],
  "Sprite": ["#006400", "#32CD32"],
  "Limca": ["#20B2AA", "#48D1CC"],
};

const CATEGORY_ICONS: Record<string, string> = {
  "Instant Noodles": "🍜",
  "Chips & Snacks": "🥔",
  "Biscuits & Cookies": "🍪",
  "Beverages": "🥤",
  "Chocolates & Sweets": "🍫",
  "Dairy": "🧈",
  "Cooking Oil": "🫒",
  "Masala & Spices": "🌶️",
  "Breakfast & Health": "🥣",
  "Sauces & Spreads": "🫙",
  "Atta & Staples": "🌾",
  "Ice Cream": "🍦",
  "Namkeen": "🥜",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const brand = searchParams.get('brand') || '';
  const category = searchParams.get('category') || '';

  if (!query && !brand) {
    return NextResponse.json({ imageUrl: null });
  }

  // Try Open Food Facts for real product images (best effort, fast timeout)
  try {
    const searchTerm = query || brand;
    const offUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchTerm)}&search_simple=1&action=process&json=1&page_size=5&fields=product_name,image_front_small_url,image_front_url,image_url`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(offUrl, { 
      signal: controller.signal,
      headers: { 'User-Agent': 'PurePlate/1.0' }
    });
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      if (data.products && data.products.length > 0) {
        for (const product of data.products) {
          // Prefer small front image (loads faster)
          const imgUrl = product.image_front_small_url || product.image_front_url || product.image_url;
          if (imgUrl && imgUrl.startsWith('http') && !imgUrl.includes('placeholder')) {
            return NextResponse.json({ imageUrl: imgUrl });
          }
        }
      }
    }
  } catch {
    // Open Food Facts timed out or failed, use placeholder
  }

  // Generate high-quality branded placeholder
  const placeholder = generatePlaceholder(brand || query.split(' ')[0], category, query);
  return NextResponse.json({ imageUrl: placeholder });
}

function generatePlaceholder(brand: string, category: string, fullName: string): string {
  const [color1, color2] = BRAND_PALETTE[brand] || ['#f7ac32', '#e8961a'];
  const emoji = CATEGORY_ICONS[category] || '📦';
  
  // Clean brand name for display
  const displayBrand = brand.length > 12 ? brand.substring(0, 12) : brand;
  // Get short product name
  const shortName = fullName.split(' ').slice(0, 3).join(' ');
  const displayName = shortName.length > 20 ? shortName.substring(0, 20) : shortName;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color1};stop-opacity:0.12"/>
      <stop offset="50%" style="stop-color:${color2};stop-opacity:0.06"/>
      <stop offset="100%" style="stop-color:${color1};stop-opacity:0.15"/>
    </linearGradient>
    <linearGradient id="shine" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:white;stop-opacity:0.03"/>
      <stop offset="100%" style="stop-color:white;stop-opacity:0"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="#0d0c0a"/>
  <rect width="400" height="400" fill="url(#bg)"/>
  <rect width="400" height="200" fill="url(#shine)"/>
  <circle cx="200" cy="155" r="55" fill="${color1}" fill-opacity="0.08" stroke="${color1}" stroke-opacity="0.15" stroke-width="1.5"/>
  <text x="200" y="172" text-anchor="middle" font-size="52">${emoji}</text>
  <text x="200" y="256" text-anchor="middle" font-family="system-ui,Arial,sans-serif" font-weight="900" font-size="22" fill="${color1}" opacity="0.8" letter-spacing="3">${displayBrand.toUpperCase()}</text>
  <line x1="140" y1="272" x2="260" y2="272" stroke="${color1}" stroke-opacity="0.2" stroke-width="1"/>
  <text x="200" y="296" text-anchor="middle" font-family="system-ui,Arial,sans-serif" font-weight="400" font-size="12" fill="white" opacity="0.25" letter-spacing="1.5">${displayName.toUpperCase()}</text>
  <rect x="0" y="0" width="400" height="3" fill="${color1}" opacity="0.6"/>
</svg>`;
  
  // Use base64 encoding instead of URL encoding for better browser compatibility
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}
