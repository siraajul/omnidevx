import fs from 'fs';
import https from 'https';

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        return downloadFile(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('Failed to download: ' + res.statusCode));
      }
      const data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => resolve(Buffer.concat(data)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function run() {
  try {
    console.log('Downloading Caveat...');
    const caveat = await downloadFile('https://raw.githubusercontent.com/google/fonts/main/ofl/caveat/Caveat-Bold.ttf');
    console.log('Downloading Kalam...');
    const kalam = await downloadFile('https://raw.githubusercontent.com/google/fonts/main/ofl/kalam/Kalam-Bold.ttf');

    const caveatB64 = caveat.toString('base64');
    const kalamB64 = kalam.toString('base64');

    let svg = fs.readFileSync('public/og-image.svg', 'utf8');
    
    // Replace the @import with base64 embedded fonts
    svg = svg.replace(/@import url\('.*?'\);/, `
      @font-face {
        font-family: 'Caveat';
        src: url(data:font/ttf;base64,${caveatB64}) format('truetype');
        font-weight: 700;
      }
      @font-face {
        font-family: 'Kalam';
        src: url(data:font/ttf;base64,${kalamB64}) format('truetype');
        font-weight: 700;
      }
    `);
    
    fs.writeFileSync('public/og-image.svg', svg);
    console.log('SVG updated with base64 embedded fonts successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

run();
