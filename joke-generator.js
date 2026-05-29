/**
 * Random Joke Generator
 * Fetches random jokes from the JokeAPI (https://jokeapi.dev/)
 */

const https = require('https');

/**
 * Fetches a random joke from the JokeAPI
 * @returns {Promise<Object>} Joke object containing setup and delivery or joke
 */
function getRandomJoke() {
  return new Promise((resolve, reject) => {
    const url = 'https://v2.jokeapi.dev/joke/Any?format=json';

    https.get(url, (res) => {
      let data = '';

      // Accumulate data chunks
      res.on('data', (chunk) => {
        data += chunk;
      });

      // Parse and resolve when complete
      res.on('end', () => {
        try {
          const jokeData = JSON.parse(data);
          resolve(jokeData);
        } catch (error) {
          reject(new Error('Failed to parse joke data'));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Formats and displays a joke
 * @param {Object} jokeData - The joke object from the API
 */
function displayJoke(jokeData) {
  console.log('\n🎭 Random Joke Generator 🎭\n');

  if (jokeData.type === 'twopart') {
    // Two-part joke (setup and delivery)
    console.log(`Setup: ${jokeData.setup}`);
    console.log(`\nPunchline: ${jokeData.delivery}`);
  } else if (jokeData.type === 'single') {
    // Single-line joke
    console.log(`Joke: ${jokeData.joke}`);
  }

  if (jokeData.flags) {
    const flags = Object.entries(jokeData.flags)
      .filter(([, value]) => value)
      .map(([key]) => key.toUpperCase());
    
    if (flags.length > 0) {
      console.log(`\n⚠️  Content flags: ${flags.join(', ')}`);
    }
  }

  console.log('\n');
}

/**
 * Main function - Fetches and displays a random joke
 */
async function main() {
  try {
    console.log('Fetching a random joke...');
    const joke = await getRandomJoke();
    displayJoke(joke);
  } catch (error) {
    console.error('Error fetching joke:', error.message);
    process.exit(1);
  }
}

// Run the generator
if (require.main === module) {
  main();
}

module.exports = { getRandomJoke, displayJoke };
