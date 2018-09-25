const jsonld = require('jsonld');
const fs = require('fs');

fs.readFile('data/loc_bib_works_test.nt', function (err, data) {
  if (err) { throw err; }
  console.log("==============")
  console.log("Input triples:")
  console.log("==============")
  console.log(data.toString());

  jsonld.fromRDF(data.toString(), {format: 'application/n-quads'}, (err, doc) => {
    if (err) { throw err; }
    console.log("===============")
    console.log("JSON-LD output:")
    console.log("===============")
    console.log(JSON.stringify(doc, null, 2));
  });
});