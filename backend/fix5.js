const fs = require('fs');
const path = 'src/services/groq.js';
let lines = fs.readFileSync(path, 'utf8').split('\n');

// 536: - Use emojis (🚨, âš  ï¸ , 🟢) to visually indicate risk levels.
lines[535] = "- Use emojis (🚨, ⚠️, 🟢) to visually indicate risk levels.";

// 548: ### ðŸ—“ï¸  Critical Dates & Deadlines
lines[547] = "### 🗓️ Critical Dates & Deadlines";

// 554: ### ðŸ“  Required Actions
lines[553] = "### 📌 Required Actions";

// 558: ### â„¹ï¸  Additional Details
lines[557] = "### ℹ️ Additional Details";

fs.writeFileSync(path, lines.join('\n'));
