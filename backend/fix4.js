const fs = require('fs');
let c = fs.readFileSync('src/services/groq.js', 'utf8');

c = c.split('âš ï¸ ').join('⚠️');
c = c.split('â„¹ï¸ ').join('ℹ️');
c = c.split('ðŸ—“ï¸ ').join('🗓️');
c = c.split('ðŸ“ ').join('📌');

fs.writeFileSync('src/services/groq.js', c);
