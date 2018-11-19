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

There are two ways:
a) install _VirtualBox_ and load the virtual disk image we provide
b) install all tools locally into your own operating system (OS)

### VirtualBox
This may be the easiest way for you to create a working environment.
The virtual disk image provides every tool mentioned under
"Installation of all tools into your operating system", set up in a linux
OS.

Note: we tested the disk image on several linux flavors like Ubuntu and
Debian and also on some MacOs. However, we experienced troubles with Linux Mint,
so if you use Mint you could give it a try but may end in "kernel panic" when
disk image starts the virtual machine. Better then to go with the manual setup.

#### Installation of VirtualBox
Follow https://www.VirtualBox.org/wiki/Downloads.
Start the box. If it doesn't come up with a GUI you may have to
install the "VirtualBox-qt" package.

#### virtual disk image
We prepared a disk image with the following apps, amongst others:

-- *OS*: Ubuntu 32bit with Xubuntu as graphical-UI
-- *browser*: chromium
-- *java*: openjdk-8-jdk
-- *elasticsearch 5.6.13*
-- *kibana 5.6.13*
-- *text editors*: visualstudio 1.29.0; gedit; vim
-- *git* , *jq*
-- *openrefine*

It's deliberately a 32bit-System to avoid possible BIOS problems.
enabled "Guest Additions" to copy'n'paste between box and host

#### Load the virtual disk image (vdi) into VirtualBox
Download the 7z-archived vdi: http://labs.lobid.org/download/.
The size of the packed file is 2.4 GB, unpacked it's 7.5 GB
(so make sure you have got enough free space).
To decompress the archive you need the 7z archiver.
Installation on debian-based linux':
'sudo apt install p7zip'
Unpack it like '7z x swib_2018-Workshop_VBox.7z'
Decompressing may take 4 minutes.

Go to your VirtualBox-GUI and click "new". Then:
Name: "swib"
Type:"Linux"
Version: "Ubuntu 32bit"
MemorySize: best >=2048
HardDrive: Use an existing one
Choose the extracted vdi, then click "create".
When you are finished a virtual machine should appear in the VirtualBox.
Start the machine.
A new window should appear with ubuntu booting until you see the graphical
login manager..

#### Configs of your virtual machine
The password for the user _I_ is "12345".
*Note*: the keyboard-layout is preconfigured to German. If you wanna change this:
Click on the blue-white icon in the top left corner under "machine", choose "settings"
on the right bottom, select "Keyboard" on the left side. Click on the "Layout" tab, unclick
the "Use system defaults", "Add" the keyboard layout you need, then push it to first position by
selecting that layout and clicking on the arrows. Close the window, you are done.

Normally it's possible to copy'n'paste between your local OS (host) and the
guest (the ubunut machine). While it's not a mandatory feature it may be handy.
If that's not working and you feel you need it: you need to install the ["Guest Additions"](https://www.virtualbox.org/manual/ch03.html#settings-general-advanced).

You machine has automatically started elasticsearch and kibana.

You are set now. Go on reading "Usage".
### Installation of all tools into your operating system
#### Prerequisites

With sample commands for Debian-based Linux systems, follow links for others.

##### Basic tools

Install [git](https://git-scm.com/):

`apt install git`

Install [cURL](https://curl.haxx.se/download.html):

`apt install curl`

Install [jq](https://stedolan.github.io/jq/download/):

`apt install jq`

##### Node.js

Install [node](https://nodejs.org/en/download/) (8.x or higher):

`curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -`

`apt install -y nodejs`

##### jsonld-cli

Install the hbz [jsonld-cli](https://github.com/hbz/jsonld-cli) fork:

`git clone https://github.com/hbz/jsonld-cli.git`

`cd jsonld-cli`

`sudo npm install -g`

For details, see [the setup instructions](https://github.com/hbz/jsonld-cli#installation).

##### Elasticsearch

Install [Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/install-elasticsearch.html) 6.x:

`wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -`

`apt install apt-transport-https`

`echo "deb https://artifacts.elastic.co/packages/6.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-6.x.list`

`sudo apt update && sudo apt install elasticsearch`

`sudo -i service elasticsearch start`

Wait a few seconds for Elasticsearch to start up, then open [http://localhost:9200/](http://localhost:9200/) to verify Elasticsearch is running.

##### openrefine

Check http://openrefine.org/download.html how to install it.

##### Kibana

Install [Kibana](https://www.elastic.co/downloads/kibana):

`sudo apt-get install kibana`

`sudo -i service kibana start`

Wait a few seconds for Kibana to start up, then open [http://localhost:5601](http://localhost:5601) to verify Kibana is running.

#### Repository

Clone the repo:

`git clone https://github.com/hbz/swib18-workshop.git`

Go to the repo:

`cd swib18-workshop`

## Usage

### Node

Install dependencies:

`npm install`

Run the code (in `js/app.js`):

`npm start`

This will serve the local context at [http://localhost:3000/context.json](http://localhost:3000/context.json).

### Command line

Run all (convert, index, and query sample data):

`cd data` ; `./process.sh`

Open `process.sh` in an editor for individual commands.

### Browser

Open `data/index.html` in a web browser.
