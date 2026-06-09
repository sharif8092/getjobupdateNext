const https = require('https');

const url = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://getjobupdate.co.in&strategy=mobile';

https.get(url, r => {
  let d = '';
  r.on('data', c => d += c);
  r.on('end', () => {
    try {
      const j = JSON.parse(d);
      if (!j.lighthouseResult) {
        console.log('API error:', JSON.stringify(j).substring(0, 300));
        return;
      }
      const lhr = j.lighthouseResult;
      console.log('=== LIVE PERFORMANCE SCORE ===');
      console.log('Score:', Math.round(lhr.categories.performance.score * 100));
      console.log('');
      ['first-contentful-paint','largest-contentful-paint','total-blocking-time','speed-index','interactive','cumulative-layout-shift'].forEach(m => {
        const a = lhr.audits[m];
        if (a) console.log(m + ': ' + a.displayValue + ' (score:' + a.score + ')');
      });
      console.log('\n--- Top Opportunities ---');
      ['mainthread-work-breakdown','bootup-time','unused-javascript','unused-css-rules','render-blocking-resources'].forEach(m => {
        const a = lhr.audits[m];
        if (a && a.score !== null && a.score < 0.9) console.log(m + ': ' + a.displayValue);
      });
    } catch(e) {
      console.log('Parse error:', e.message);
      console.log('Raw:', d.substring(0, 300));
    }
  });
}).on('error', e => console.log('Network error:', e.message));
