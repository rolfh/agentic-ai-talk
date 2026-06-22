import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to read .env file and populate process.env
function loadEnv() {
  try {
    const envPath = path.resolve(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split(/\r?\n/).forEach((line) => {
        // Ignore comments and empty lines
        if (line.trim().startsWith('#') || !line.includes('=')) return;
        
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=').trim();
        
        // Remove surrounding quotes if they exist
        const cleanedValue = value.replace(/^['"]|['"]$/g, '');
        
        process.env[key.trim()] = cleanedValue;
      });
    }
  } catch (error) {
    console.warn('Could not load .env file:', error);
  }
}

// Load env variables
loadEnv();

// Retrieve the API key (since the key contains a hyphen, we access it via bracket notation)
const apiKey = process.env['GPC-API-KEY'];

if (!apiKey) {
  console.error('Error: GPC-API-KEY is not defined in the environment or .env file.');
  process.exit(1);
}

/**
 * Fetch function to call the Gemini API
 * @param {string} promptText 
 */
async function generateContent(promptText) {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';
  
  const payload = {
    contents: [
      {
        parts: [
          {
            text: promptText
          }
        ]
      }
    ]
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': apiKey
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Request failed with status ${response.status}: ${errorText}`);
  }

  return await response.json();
}

// Example usage
const prompt = 'Explain how AI works in a few words';
console.log(`Sending prompt: "${prompt}"...`);

generateContent(prompt)
  .then((data) => {
    console.log('API Response data:');
    console.log(JSON.stringify(data, null, 2));
    
    // Extract and log the generated text response if available
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (candidateText) {
      console.log('\n--- Generated Text ---');
      console.log(candidateText);
      console.log('----------------------');
    }
  })
  .catch((error) => {
    console.error('Error calling Gemini API:', error);
  });
