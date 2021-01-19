fst viz tool
============

A fork of the small visualization tool built by the design team during Digital Methods Summer School 2019, Amsterdam.

The visualisation tool was developed further by Alice Strete and Angeliki Diakrousi, with the help of André Fincato as part of the [Feminist Search Tools] (https://fst.swummoq.net/) project.

The tool is built using [D3 js] (https://d3js.org/).

*Clusters:*

After long discussion we had with fst we decided to create specific clusters of terms, represented in different x-axes, that would help us have a situated perspective on the collection and see what books reflect the questions we addressed in our discussions - for example how much are race and disability reflected in the collection.  We wanted to challenge the categorization of books in public library structures and the lack of opportunities to intervene in these categories. These standard categorization systems are often institutional and carry biases. They also restrict the intersectionality and flexibility of the character or potential identities of books.

*Hovers on axis terms:*

When hovering on the terms you can see more information about each term
Interventions from FST, context from homosaurus, related terms that are not necessarily connected in homosaurus, terms we would like to change depending on preferred terms in society, terms that are not currently part of the descriptions, and even expanding the meaning of a term.

*Red links:*

Terms that don't exist in the current categories but are proposed as potential new categories (they don't have any books) - highlighted in red

*Groups of books*

The intersection between a publisher and a certain term on the x axis, on hover you can see title, author and other terms found in the description of the book, either from the same cluster or another or even terms that are not in any cluster

*Intersectionality:*

Each cluster has it's own color. To highlight intersectionality we also searched for books that have descriptions belonging to two different clusters - these are made visible through the use of these colors

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

use `import-data.py` to create subset of data from the main dataset. for the original dataset used in the project, contact the developers.

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

this will automatically output the new sub-dataset to the `./data/` folder, using the `topic` argument to save the file. with the example above, the file will be saved as `dataset_sexuality.json`. do this for every topic available.

## setup

the dataset used by `d3` is set in `d3viz.js`, at line `11`:

```
d3.json("fst.json")
```

you can change the path to the file (`fst.json`), with another file.

each record in the `json` array *needs* to follow this structure:

```
{
  "title":
    "Example title",
  "author":
    "Example author",
  "publisher":
    "Example publisher",
  "description":
    "Example description",
  "description_second":
    "Example extra description",
  "other_descriptions":
    ["example1", "example2", "example3"]
},
```

you can add more records to your dataset, but keeping this data structure.

you can of course change data structure by changing the `d3viz.js` script, eg by asking d3 to print other keys from the list of records in your dataset json file. review the `d3viz.js` by doing a search-query of any key (eg `free_descriptors`) you want to change and see where it’s being used in the script. then replace them with the new keys you want to use.
