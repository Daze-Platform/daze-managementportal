import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MenuItem {
  name: string;
  description?: string;
  price: number;
  category: string;
  modifiers?: string[];
}

interface ParsedMenu {
  menuName: string;
  description?: string;
  category: string;
  items: MenuItem[];
}

serve(async (req) => {
  console.log('Function called with method:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting PDF processing...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    console.log('Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      hasOpenAIKey: !!openAIApiKey
    });

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing');
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('Supabase client created');

    let formData;
    try {
      formData = await req.formData();
      console.log('Form data parsed successfully');
    } catch (error) {
      console.error('Failed to parse form data:', error);
      throw new Error('Invalid form data');
    }

    const file = formData.get('file') as File;
    const storeId = formData.get('storeId') as string;
    const resortId = formData.get('resortId') as string;

    console.log('Form data:', {
      hasFile: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      storeId,
      resortId
    });

    if (!file) {
      throw new Error('No file provided');
    }

    if (file.type !== 'application/pdf') {
      throw new Error('File must be a PDF');
    }

    console.log('Processing PDF file:', file.name, 'Size:', file.size);

    // Upload PDF to storage
    const fileName = `${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('menu-pdfs')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Failed to upload PDF: ${uploadError.message}`);
    }

    console.log('PDF uploaded successfully:', uploadData.path);

    // Get the file URL to download and process
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from('menu-pdfs')
      .createSignedUrl(fileName, 3600); // 1 hour expiry

    if (urlError || !signedUrlData?.signedUrl) {
      console.error('Signed URL error:', urlError);
      throw new Error('Failed to get signed URL for PDF');
    }

    console.log('Got signed URL, downloading PDF...');

    // Download the PDF file
    const pdfResponse = await fetch(signedUrlData.signedUrl);
    if (!pdfResponse.ok) {
      throw new Error(`Failed to download PDF: ${pdfResponse.status} ${pdfResponse.statusText}`);
    }
    
    const pdfBuffer = await pdfResponse.arrayBuffer();
    console.log('Downloaded PDF, size:', pdfBuffer.byteLength);

    // Convert PDF to text using a simple approach
    const pdfText = await extractTextFromPDF(pdfBuffer);
    
    console.log('Extracted text length:', pdfText.length);
    console.log('Text preview:', pdfText.substring(0, 500));

    if (pdfText.length < 50) {
      throw new Error('Could not extract enough text from PDF. Please ensure the PDF contains readable text.');
    }

    // Use OpenAI to parse the menu text
    const parsedMenu = await parseMenuWithAI(pdfText, openAIApiKey);
    
    console.log('Parsed menu:', JSON.stringify(parsedMenu, null, 2));

    // Save the parsed menu to database
    const menuData = {
      name: parsedMenu.menuName,
      description: parsedMenu.description,
      category: parsedMenu.category,
      items: parsedMenu.items,
      store_id: storeId ? parseInt(storeId) : null,
      resort_id: resortId || null,
      is_active: true
    };

    const { data: savedMenu, error: saveError } = await supabase
      .from('menus')
      .insert(menuData)
      .select()
      .single();

    if (saveError) {
      console.error('Save error:', saveError);
      throw new Error(`Failed to save menu: ${saveError.message}`);
    }

    console.log('Menu saved successfully:', savedMenu.id);

    // Clean up - delete the uploaded PDF
    await supabase.storage
      .from('menu-pdfs')
      .remove([fileName]);

    return new Response(
      JSON.stringify({ 
        success: true, 
        menu: savedMenu,
        itemCount: parsedMenu.items.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error processing PDF menu:', error);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process PDF menu',
        details: error.message,
        type: error.name || 'Unknown error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

async function extractTextFromPDF(pdfBuffer: ArrayBuffer): Promise<string> {
  // Simple PDF text extraction
  const uint8Array = new Uint8Array(pdfBuffer);
  const decoder = new TextDecoder('utf-8', { fatal: false });
  
  let text = '';
  
  // Look for text objects in PDF
  const pdfString = decoder.decode(uint8Array);
  
  // Extract text between parentheses and brackets (common PDF text markers)
  const textMatches = pdfString.match(/\((.*?)\)/g);
  if (textMatches) {
    text = textMatches
      .map(match => match.slice(1, -1)) // Remove parentheses
      .filter(t => t.length > 0 && !t.match(/^[0-9.]+$/)) // Filter out just numbers
      .join(' ');
  }
  
  // Also look for text after 'Tj' operators
  const tjMatches = pdfString.match(/\[(.*?)\]\s*TJ/g);
  if (tjMatches) {
    const tjText = tjMatches
      .map(match => match.replace(/\[(.*?)\]\s*TJ/, '$1'))
      .join(' ');
    text += ' ' + tjText;
  }
  
  // Clean up the text
  text = text
    .replace(/\\[rn]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  return text || 'Could not extract text from PDF. Please ensure the PDF contains readable text.';
}

async function parseMenuWithAI(menuText: string, apiKey: string): Promise<ParsedMenu> {
  const prompt = `
You are a menu parsing expert. Parse the following menu text and extract menu items with their details.

Return a JSON object with this exact structure:
{
  "menuName": "Name of the menu/restaurant",
  "description": "Brief description if available",
  "category": "Main category (e.g., 'Restaurant Menu', 'Breakfast', 'Dinner', etc.)",
  "items": [
    {
      "name": "Item name",
      "description": "Item description (optional)",
      "price": 12.99,
      "category": "Item category (e.g., 'Appetizers', 'Main Course', 'Desserts')",
      "modifiers": ["Optional modifier 1", "Optional modifier 2"]
    }
  ]
}

Guidelines:
- Extract all menu items with prices
- Group items by logical categories
- Include descriptions when available
- Convert prices to numbers (remove currency symbols)
- If no clear menu name, use "Imported Menu"
- If prices are missing, set to 0
- Categories should be clear and descriptive

Menu Text:
${menuText}
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are a helpful assistant that parses menu text and returns valid JSON. Always return properly formatted JSON.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1,
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error('OpenAI API error:', data);
    throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
  }

  const content = data.choices[0].message.content;
  
  try {
    // Remove markdown code blocks if present
    let jsonContent = content;
    if (content.includes('```json')) {
      jsonContent = content.replace(/```json\s*/, '').replace(/\s*```$/, '');
    } else if (content.includes('```')) {
      jsonContent = content.replace(/```\s*/, '').replace(/\s*```$/, '');
    }
    
    console.log('Cleaned JSON content:', jsonContent);
    
    const parsed = JSON.parse(jsonContent);
    
    // Validate the structure
    if (!parsed.menuName || !Array.isArray(parsed.items)) {
      throw new Error('Invalid menu structure returned by AI');
    }
    
    // Ensure all items have required fields
    parsed.items = parsed.items.map((item: any) => ({
      name: item.name || 'Unknown Item',
      description: item.description || '',
      price: typeof item.price === 'number' ? item.price : 0,
      category: item.category || 'Uncategorized',
      modifiers: Array.isArray(item.modifiers) ? item.modifiers : []
    }));
    
    return {
      menuName: parsed.menuName,
      description: parsed.description || '',
      category: parsed.category || 'Restaurant Menu',
      items: parsed.items
    };
    
  } catch (parseError) {
    console.error('JSON parse error:', parseError);
    throw new Error(`Failed to parse AI response as JSON: ${parseError.message}`);
  }
}