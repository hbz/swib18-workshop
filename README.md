# swib18-workshop <small>[✎](http://etherpad.lobid.org/mypads/?/mypads/group/lobid-mm5v3lj/pad/view/swib18-workshop-o21dx3u5)</small>

## Abstract

From LOD to LOUD: making data usable

Linked Open Usable Data (LOUD) extends Linked Open Data (LOD) by focussing on use cases, being as simple as possible, and providing developer friendly web APIs with JSON-LD. The term was coined [by Rob Sanderson](https://www.slideshare.net/azaroth42/europeanatech-keynote-shout-it-out-loud). [This workshop](http://swib.org/swib18/programme.html#abs03) will introduce you to the basic concepts of LOUD, web APIs, and JSON-LD. You'll learn how to publish and document data as LOUD, and how to use that data in different contexts.

In this workshop, we will:

- Convert RDF data into usable [JSON-LD](https://json-ld.org/)
- Index and query the data with [Elasticsearch](https://www.elastic.co/products/elasticsearch)
- Create a simple web application using the data
- Visualize the data with [Kibana](https://www.elastic.co/products/kibana)
- Document the data with [Hypothesis annotations](https://web.hypothes.is/)
- Use the data with [OpenRefine](http://openrefine.org/)

Audience: librarians and developers working with linked open data.

Requirements: Laptop with [Elasticsearch 6.x](https://www.elastic.co/guide/en/elasticsearch/reference/current/_installation.html), [OpenRefine 2.8](https://github.com/OpenRefine/OpenRefine/wiki/Installation-Instructions), a text editor, web browser, and a command line with [cURL](https://curl.haxx.se/download.html) and [jsonld.js via node.js](https://github.com/digitalbazaar/jsonld.js#installation). As an alternative, we'll also provide a fully configured virtual machine to workshop participants.

## Setup

Install npm:

`sudo apt install npm`

Clone the repo:

`git clone https://github.com/hbz/swib18-workshop.git`

Go to the repo:

`cd swib18-workshop`

Install dependencies:

`npm install`

Run the code:

`npm start`