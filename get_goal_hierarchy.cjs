const fs = require('fs');
const glbPath = '/Users/rolf/Github/agentic-ai-talk/public/models/soccer_goal.glb';
const buffer = fs.readFileSync(glbPath);

const jsonLength = buffer.readUInt32LE(12);
const jsonStr = buffer.toString('utf8', 20, 20 + jsonLength);
const gltf = JSON.parse(jsonStr);

console.log('--- SOCCER GOAL NODES ---');
gltf.nodes.forEach((node, index) => {
  console.log(`Node ${index}: Name: "${node.name || ''}"`);
  if (node.translation) console.log(`  Translation: ${JSON.stringify(node.translation)}`);
  if (node.rotation) console.log(`  Rotation: ${JSON.stringify(node.rotation)}`);
  if (node.scale) console.log(`  Scale: ${JSON.stringify(node.scale)}`);
  if (node.mesh !== undefined) console.log(`  Mesh: ${node.mesh}`);
  if (node.children) console.log(`  Children: ${JSON.stringify(node.children)}`);
});
