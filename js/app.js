const jsonld = require('jsonld');
const fs = require('fs');
const util = require('util');
const http = require('http');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const deleteFile = util.promisify(fs.unlink);

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
  .then(bulk)
  .then(compact)
  .then(use);

async function use(data) {
  console.log('=== Work: ===');
  console.log('title:', data.label);
  console.log('author:', data.contribution[0].agent.label);
  console.log('==============');
}

// =========================
// Serve the context locally
// =========================

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/ld+json');
  var fileStream = fs.createReadStream('data/context.json');
  fileStream.pipe(res);
});

const hostname = '127.0.0.1';
const port = 3000;
server.listen(port, hostname, () => {
  console.log(`Serving context at http://${hostname}:${port}/\n`);
});

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

// ===============================
// Write Elasticsearch bulk format
// ===============================

async function bulk(input) {
  await deleteFile('data/bulk.ndjson');
  const context = await readFile('data/context.json');
  const writer = fs.createWriteStream('data/bulk.ndjson', { flags: 'a' })
  const docs = input["@graph"];
  await writeDocs(docs, context, writer);
  return docs[docs.length == 1 ? 0 : 1];
}

async function writeDocs(docs, context, writer) {
  for(i in docs) {
    const compact = await jsonld.compact(docs[i], JSON.parse(context), {'compactArrays': true});
    compact['@context'] = `http://${hostname}:${port}/context.json`;
    const meta = {index: {_index: 'loc', _type: 'work', _id: compact.id.split('/').pop()}};
    writer.write(JSON.stringify(meta) + '\n');
    writer.write(JSON.stringify(compact) + '\n');
  }
}
