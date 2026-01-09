// Smart keyword-based image matching for menu items
// This provides accurate, context-aware image selection without backend calls

interface FoodImage {
  url: string;
  keywords: string[];
  category: string;
}

const FOOD_IMAGE_DATABASE: FoodImage[] = [
  {
    url: '/images/menu/margherita-pizza.jpg',
    keywords: ['pizza', 'margherita', 'italian', 'cheese', 'tomato', 'basil', 'mozzarella', 'flatbread'],
    category: 'pizza'
  },
  {
    url: '/images/menu/pepperoni-pizza.jpg',
    keywords: ['pizza', 'pepperoni', 'spicy', 'meat', 'sausage'],
    category: 'pizza'
  },
  {
    url: '/images/menu/pizza.jpg',
    keywords: ['pizza', 'slice', 'classic', 'cheese pizza'],
    category: 'pizza'
  },
  {
    url: '/images/menu/grilled-salmon.jpg',
    keywords: ['salmon', 'fish', 'grilled', 'seafood', 'fillet', 'atlantic', 'baked', 'pan-seared', 'omega'],
    category: 'seafood'
  },
  {
    url: '/images/menu/caesar-salad.jpg',
    keywords: ['salad', 'caesar', 'lettuce', 'romaine', 'croutons', 'parmesan', 'anchovy'],
    category: 'salad'
  },
  {
    url: '/images/menu/house-salad.jpg',
    keywords: ['salad', 'house', 'garden', 'fresh', 'vegetables', 'mixed greens', 'side salad', 'green salad'],
    category: 'salad'
  },
  {
    url: '/images/menu/salad.jpg',
    keywords: ['salad', 'healthy', 'veggies', 'light', 'diet'],
    category: 'salad'
  },
  {
    url: '/images/menu/fish-tacos.jpg',
    keywords: ['taco', 'tacos', 'fish', 'seafood', 'baja', 'mahi', 'cod'],
    category: 'mexican'
  },
  {
    url: '/images/menu/tacos.jpg',
    keywords: ['taco', 'tacos', 'mexican', 'beef', 'chicken', 'meat', 'tortilla', 'carnitas', 'carne', 'asada', 'al pastor'],
    category: 'mexican'
  },
  {
    url: '/images/menu/burger.jpg',
    keywords: ['burger', 'hamburger', 'beef', 'patty', 'bun', 'cheeseburger', 'angus', 'wagyu', 'smash'],
    category: 'burger'
  },
  {
    url: '/images/menu/cheesecake.jpg',
    keywords: ['cheesecake', 'dessert', 'cake', 'cream cheese', 'sweet', 'new york', 'strawberry cheesecake'],
    category: 'dessert'
  },
  {
    url: '/images/menu/gelato.jpg',
    keywords: ['gelato', 'ice cream', 'dessert', 'italian', 'frozen', 'sweet', 'sorbet', 'sundae', 'scoop'],
    category: 'dessert'
  },
  {
    url: '/images/menu/iced-tea.jpg',
    keywords: ['tea', 'iced tea', 'drink', 'beverage', 'lemon', 'sweet tea', 'cold drink', 'refreshing'],
    category: 'beverage'
  },
  {
    url: '/images/menu/margarita-cocktail.jpg',
    keywords: ['margarita', 'cocktail', 'drink', 'beverage', 'tequila', 'lime', 'alcohol', 'mixed drink', 'mojito', 'daiquiri'],
    category: 'beverage'
  }
];

/**
 * Finds the best matching image for a menu item based on name and description
 * Uses keyword scoring to determine relevance
 */
export const findBestMatchingImage = (itemName: string, description: string = ''): string => {
  const searchText = `${itemName} ${description}`.toLowerCase();
  const words = searchText.split(/\s+/).filter(word => word.length > 2);
  
  let bestMatch = { url: '', score: 0 };
  
  for (const image of FOOD_IMAGE_DATABASE) {
    let score = 0;
    
    for (const keyword of image.keywords) {
      // Exact word match = highest score
      if (words.includes(keyword)) {
        score += 15;
      }
      // Keyword is contained within the search text (partial match)
      else if (searchText.includes(keyword)) {
        score += 8;
      }
      // Word starts with keyword or keyword starts with word
      else {
        for (const word of words) {
          if (word.startsWith(keyword) || keyword.startsWith(word)) {
            score += 5;
            break;
          }
        }
      }
    }
    
    // Category bonus for strong category matches
    if (searchText.includes(image.category)) {
      score += 5;
    }
    
    if (score > bestMatch.score) {
      bestMatch = { url: image.url, score };
    }
  }
  
  // If no good match found (score < 5), return a contextual fallback
  if (bestMatch.score < 5) {
    // Try to at least match by first word category
    const firstWord = words[0];
    const categoryFallback = FOOD_IMAGE_DATABASE.find(img => 
      img.category === firstWord || img.keywords.some(k => k === firstWord)
    );
    
    if (categoryFallback) {
      return categoryFallback.url;
    }
    
    // Ultimate fallback - random image
    return FOOD_IMAGE_DATABASE[Math.floor(Math.random() * FOOD_IMAGE_DATABASE.length)].url;
  }
  
  return bestMatch.url;
};

/**
 * Simulates AI generation with progress updates
 */
export const simulateImageGeneration = async (
  onProgress: (progress: number) => void,
  duration: number = 2500
): Promise<void> => {
  const steps = 20;
  const stepDuration = duration / steps;
  
  for (let i = 1; i <= steps; i++) {
    await new Promise(resolve => setTimeout(resolve, stepDuration));
    onProgress(Math.round((i / steps) * 100));
  }
};
