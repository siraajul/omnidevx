const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport to iPhone SE (375x667)
  await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
  
  await page.goto('http://localhost:4321', { waitUntil: 'networkidle2' });
  
  // Wait a bit for animations
  await new Promise(r => setTimeout(r, 2000));
  
  // Check scroll width
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  
  console.log(`Viewport width: ${clientWidth}px`);
  console.log(`Scroll width: ${scrollWidth}px`);
  
  if (scrollWidth > clientWidth) {
    console.log('⚠️ HORIZONTAL OVERFLOW DETECTED!');
    
    // Find overflowing elements
    const overflowingElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const badElements = [];
      const bodyWidth = document.body.clientWidth;
      
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.right > bodyWidth) {
          badElements.push(`${el.tagName} ${el.className.substring(0, 50)} (Right: ${rect.right})`);
        }
      });
      return badElements;
    });
    
    console.log('Elements pushing out of bounds:');
    overflowingElements.forEach(el => console.log(el));
  } else {
    console.log('✅ NO horizontal overflow! Site is responsive on 375px.');
  }
  
  await browser.close();
})();
