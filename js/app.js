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

    var frame = {
      "@type": "http://id.loc.gov/ontologies/bibframe/Work",
      "@embed": "@always"
    };

    jsonld.frame(doc, frame, (err, framed) => {
      console.log("===============")
      console.log("JSON-LD framed:")
      console.log("===============")
      console.log(JSON.stringify(framed, null, 2));

      fs.readFile('data/bibframe-context.jsonld', function (err, context) {
        jsonld.compact(framed, JSON.parse(context), function(err, compacted) {
          if(err) {console.log(err);}
          console.log("================")
          console.log("JSON-LD compact:")
          console.log("================")
          console.log(JSON.stringify(compacted, null, 2));
        });
      });

    });
  });
});