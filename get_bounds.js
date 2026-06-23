const fs = require('fs');
const { parse } = require('gltf-pipeline');
// Wait, gltf-pipeline parse might be asynchronous and we don't have it installed maybe?
// Let's just adjust the scale to 0.02 first and see.
