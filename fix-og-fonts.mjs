import fs from 'fs';
import https from 'https';

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        return downloadFile(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('Failed to download from ' + url + ' (Status: ' + res.statusCode + ')'));
      }
      const data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => resolve(Buffer.concat(data)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function tryDownload(urls, name) {
  for (const url of urls) {
    try {
      console.log(`Trying to download ${name} from ${url}...`);
      const data = await downloadFile(url);
      console.log(`✅ Success for ${name}!`);
      return data;
    } catch (e) {
      console.log(`❌ Failed: ${e.message}`);
    }
  }
  throw new Error(`Could not download ${name} from any source.`);
}

async function run() {
  try {
    const caveatUrls = [
      'https://raw.githubusercontent.com/googlefonts/caveat/main/fonts/ttf/Caveat-Bold.ttf',
      'https://raw.githubusercontent.com/google/fonts/main/ofl/caveat/Caveat-Bold.ttf',
      'https://raw.githubusercontent.com/google/fonts/master/ofl/caveat/Caveat-Bold.ttf'
    ];
    
    const kalamUrls = [
      'https://raw.githubusercontent.com/itfoundry/kalam/master/fonts/Kalam-Bold.ttf',
      'https://raw.githubusercontent.com/google/fonts/main/ofl/kalam/Kalam-Bold.ttf',
      'https://raw.githubusercontent.com/google/fonts/master/ofl/kalam/Kalam-Bold.ttf'
    ];

    const caveat = await tryDownload(caveatUrls, 'Caveat');
    const kalam = await tryDownload(kalamUrls, 'Kalam');

    const caveatB64 = caveat.toString('base64');
    const kalamB64 = kalam.toString('base64');

    let svg = fs.readFileSync('public/og-image.svg', 'utf8');
    
    // Wipe out any existing font-face or imports
    svg = svg.replace(/<style>[\s\S]*?<\/style>/, '');
    
    // Inject the robust base64 strings
    svg = svg.replace('<defs>', `<defs>
      <style>
        @font-face {
          font-family: 'Caveat';
          src: url(data:font/ttf;charset=utf-8;base64,${caveatB64}) format('truetype');
          font-weight: 700;
        }
        @font-face {
          font-family: 'Kalam';
          src: url(data:font/ttf;charset=utf-8;base64,${kalamB64}) format('truetype');
          font-weight: 700;
        }
      </style>`);
    
    fs.writeFileSync('public/og-image.svg', svg);
    console.log('\n🎉 SVG updated with embedded base64 fonts successfully!');
    console.log('🎉 You can now run `npm run build` or `node scripts/generate-og.mjs` to generate the OG images with the correct fonts.');
  } catch (error) {
    console.error('\n💥 Critical Error:', error.message);
  }
}

run();
