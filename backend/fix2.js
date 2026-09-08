const fs = require('fs');
let c = fs.readFileSync('src/services/groq.js', 'utf8');

c = c.replace(/âš.ï¸ /g, '⚠️');
c = c.replace(/âš™ï¸ /g, '⚙️');
c = c.replace(/â„¹ï¸ /g, 'ℹ️');

fs.writeFileSync('src/services/groq.js', c);
