const fs = require('fs');
const glbPath = '/Users/rolf/Github/agentic-ai-talk/public/models/soccer_goal.glb';
const buffer = fs.readFileSync(glbPath);

const jsonLength = buffer.readUInt32LE(12);
const jsonStr = buffer.toString('utf8', 20, 20 + jsonLength);
const gltf = JSON.parse(jsonStr);

console.log('--- SOCCER GOAL ACCESSORS ---');
gltf.accessors.forEach((accessor, index) => {
  if (accessor.min && accessor.max && accessor.min.length === 3) {
    // Look at POSITION accessors
    console.log(`Accessor ${index}: Min: ${JSON.stringify(accessor.min)}, Max: ${JSON.stringify(accessor.max)}`);
  }
});
