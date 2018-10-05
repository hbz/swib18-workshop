const jsonld = require('jsonld');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// ===============================
// 1. Use JSON from the GitHub API
// ===============================

var request = require('request');
var options = {
  url: 'https://api.github.com/repos/hbz/swib18-workshop',
  headers: { 'User-Agent': 'fsteeg' }
};
request(options, (error, response, body) => {
  var doc = JSON.parse(body);
  console.log();
  console.log('=== Repo: ====');
  console.log('statusCode:', response && response.statusCode);
  console.log('license.name:', doc.license.name)
  console.log('==============');
});

// =====================================
// 2. Use JSON-LD created from N-Triples
// =====================================

loadTriples()
  .then(toJsonLd)
  .then(frame)
  .then(compact)
  .then(use);

async function use(data) {
  console.log('=== Work: ===');
  console.log('title:', data.label);
  console.log('author:', data.contribution[0].agent.label);
  console.log('==============');
}

// ======================
// Functions called above
// ======================

async function loadTriples() { return await readFile('data/loc.nt'); }

async function toJsonLd(input) {
  const output = await jsonld.fromRDF(input.toString(), {format: 'application/n-quads'});
  await writeFile('data/loc.json', JSON.stringify(output, null, 2));
  return output;
}

async function frame(input) {
  const frame = {
    "@type": "http://id.loc.gov/ontologies/bibframe/Work",
    "@embed": "@always"
  };
  const framed = await jsonld.frame(input, frame);
  await writeFile('data/loc-framed.json', JSON.stringify(framed, null, 2));
  return framed;
}

async function compact(input) {
  const context = await readFile('data/context.json');
  const compact = await jsonld.compact(input, JSON.parse(context), {'compactArrays': true});
  await writeFile('data/loc-compact.json', JSON.stringify(compact, null, 2));
  return compact;
}
