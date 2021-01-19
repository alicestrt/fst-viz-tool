fst viz tool
============

A fork of the small visualization tool built by the design team during Digital Methods Summer School 2019, Amsterdam.

The visualisation tool was developed further by Alice Strete and Angeliki Diakrousi, with the help of André Fincato as part of the [Feminist Search Tools] (https://fst.swummoq.net/) project.

The tool is built using [D3 js] (https://d3js.org/).

## usage

we need a local server in order to open `index.html` and avoid nasty [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors) errors ([ref](https://stackoverflow.com/a/27986564))

to do that, open a terminal and check your python version

```
python -V
```

if you have python 3, do (inside the project folder)

```
python -m http.server
```

if you have python (2), do

```
python -m SimpleHTTPServer
```

in the terminal output, you should see

```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

open your web browser and paste in

```
http://0.0.0.0:8000/
```

the visualization tool should be loading fine!

### import-data

use `import-data.py` to create subset of data from the main dataset.

the command takes two arguments:

- the input source
- the data topic

```
python import-data.py </path/to/source-dataset.json> <topic>
```

eg

```
python import-data.py ./data/dataset_selection.json sexuality
```

this will automatically output the new sub-dataset to the `./data/` folder, using the `topic` argument to save the file. with the example above, the file will be saved as `dataset_sexuality.json`.

## setup

the dataset used by `d3` is set in `d3viz.js`, at line `11`:

```
d3.json("fst.json")
```

you can change the path to the file (`fst.json`), with another file.

each record in the `json` array *needs* to follow this structure:

```
{
  "author": 
    "XYZ",
  "title": 
    "Example title",
  "publisher": 
    "Example publisher",
  "description": 
    "sexuality",
  "other_descriptions": [
    "gender", "social class", "race"
    ]
},
```

you can add more records to your dataset, but keeping this data structure.

you can of course change data structure by changing the `d3viz.js` script, eg by asking d3 to print other keys from the list of records in your dataset json file. review the `d3viz.js` by doing a search-query of any key (eg `free_descriptors`) you want to change and see where it’s being used in the script. then replace them with the new keys you want to use.
