#!/bin/bash
set -euo pipefail # See http://redsymbol.net/articles/unofficial-bash-strict-mode/
IFS=$'\n\t'

err_report() {
    echo "Error on line $1"
}

trap 'err_report $LINENO' ERR

# Convert single document
jsonld import loc.nt > loc.json
jsonld frame -f frame.json loc.json > loc-framed.json
jsonld compact -c context.json loc-framed.json > loc-compact.json

# Use single document
cat loc-compact.json | jq '.label'
cat loc-compact.json | jq '.contribution[0].agent.label'

# Convert 100 documents
jsonld import loc-100.nt > loc-100.json
jsonld frame -f frame.json loc-100.json > loc-100-framed.json
jsonld compact -c context.json loc-100-framed.json > loc-100-compact.json

# Create bulk index format
FILTER='.["@graph"][] | "\({index:{_index:"loc",_type:"work",_id:(.id/"/")|last}})\n\({"@context":"http://localhost:3000/context.json"}+.)"'
cat loc-100-compact.json | jq -c -r "$FILTER" > loc-100-bulk.ndjson
head -n 2 loc-100-bulk.ndjson

# Index in Elasticsearch
curl -XDELETE localhost:9200/loc ; echo
curl -s -H "Content-Type: application/x-ndjson" -XPOST localhost:9200/_bulk --data-binary "@loc-100-bulk.ndjson" | jq '.items | length'
sleep 1

# Use index
curl -s "localhost:9200/loc/work/_search" | jq '.hits.total'
curl -s "localhost:9200/loc/work/_search?q=contribution.agent.label:Parliament" | jq '.hits.total'
curl -s "localhost:9200/loc/work/11%23Work240-15/_source" | jq '.'

# Remote JSON-LD to N-Quads
jsonld format -q http://localhost:9200/loc/work/11%23Work240-15/_source
