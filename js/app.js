const jsonld = require('jsonld');
const fs = require('fs');

fs.readFile('data/loc_bib_works_test.nt', function (err, data) {
  if (err) { throw err; }
  jsonld.fromRDF(data.toString(), {format: 'application/n-quads'}, (err, doc) => {
    if (err) { throw err; }
    var frame = {
      "@type": "http://id.loc.gov/ontologies/bibframe/Work",
      "@embed": "@always"
    };
    jsonld.frame(doc, frame, (err, framed) => {
      if (err) { throw err; }
      fs.readFile('data/bibframe-context.jsonld', function (err, context) {
        jsonld.compact(framed, JSON.parse(context), function(err, compacted) {
          if(err) {console.log(err);}
          var final = postprocess(compacted);
          console.log('=== Works: ===')
          for(i in final) {
            console.log(final[i].contribution[0].agent[0].label + ': ' + final[i].label);
          }
          console.log('==============')
          write('data/loc_bib_works_test-1_output.json', doc);
          write('data/loc_bib_works_test-2_framed.json', framed);
          write('data/loc_bib_works_test-3_compact.json', compacted);
          write('data/loc_bib_works_test-4_final.json', final);
        });
      });
    });
  });
});

function write(location, content) {
  fs.writeFile(location, JSON.stringify(content, null, 2), (err) => {
    if (err) throw err;
    console.log('Wrote: ' + location);
  });
}

function postprocess(content) {
  var docs = content['@graph'];
  var clean = [];
  for(i in docs) {
    var cleanDoc = {
      '@context': 'https://raw.githubusercontent.com/hbz/swib18-workshop/2-convert/data/bibframe-context.jsonld'
    };
    for(x in docs[i]) {
      cleanDoc[x] = docs[i][x];
    }
    clean.push(cleanDoc);
  }
  return clean;
}