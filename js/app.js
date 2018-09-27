const jsonld = require('jsonld');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

loadTriples()
  .then(toJsonLd)
  .then(frame)
  .then(compact)
  .then(postprocess)
  .then(use);

async function use(data) {
  console.log('=== Works: ===')
  for(i in data) {
    console.log(data[i].contribution[0].agent[0].label + ': ' + data[i].label);
  }
  console.log('==============')
}

async function loadTriples() { return await readFile('data/loc_bib_works_test.nt'); }

async function toJsonLd(input) {
  const output = await jsonld.fromRDF(input.toString(), {format: 'application/n-quads'});
  await writeFile('data/loc_bib_works_test-1_output.json', JSON.stringify(output, null, 2));
  return output;
}

async function frame(input) {
  const frame = {
    "@type": "http://id.loc.gov/ontologies/bibframe/Work",
    "@embed": "@always"
  };
  const framed = await jsonld.frame(input, frame);
  await writeFile('data/loc_bib_works_test-2_framed.json', JSON.stringify(framed, null, 2));
  return framed;
}

async function compact(input) {
  const context = await readFile('data/bibframe-context.jsonld');
  const compact = await jsonld.compact(input, JSON.parse(context));
  await writeFile('data/loc_bib_works_test-3_compact.json', JSON.stringify(compact, null, 2));
  return compact;
}

async function postprocess(input) {
  const final = input['@graph'].map(oldDoc => {
	const contextUrl = 'https://raw.githubusercontent.com/hbz/swib18-workshop/2-convert/data/bibframe-context.jsonld';
    const newDoc = { '@context': contextUrl };
    for(x in oldDoc) { newDoc[x] = oldDoc[x]; }
    return newDoc;
  });
  await writeFile('data/loc_bib_works_test-4_final.json', JSON.stringify(final, null, 2));
  return final;
}
