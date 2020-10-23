# -- use python's set to find intersections between dataset
#    eg, same book part of two or more datasets
#    mark intersected items with new field and output new `<file>.json`

import sys
import os
import json

# -- get list of files from `./data/*`
#    take out `data-selection.json`, as it's the source data to build all others
#    `python find_intersections ./data/`
input_path = sys.argv[1]
paths = [os.path.join(input_path, fn) for fn in next(os.walk(input_path))[2]]
filepaths = []
for filepath in paths:
    if filepath.split('/')[2] != 'dataset_selection.json':
        filepaths.append(filepath)

# -- append each file.json to index[] in the format
#    {data: <file-content>, label: <filename>}
index = []
for filepath in filepaths:
    with open(filepath, 'r') as f:
        data = json.load(f)
        label = '-'.join(filepath.split('/')[2].split('.')[0].split('_')[1:])
        dataset = {'label': label, 'data': data}
        index.append(dataset)

data_sets = []
for dataset in index:
    new_set = set()
    for item in dataset['data']:
        if 'title' in item:
            new_set.add(item['title'])
        if 'description' in item:
            new_set.add(item['description'])

    data_sets.append(new_set)

# -- do set intersection
for idx, dataset in enumerate(data_sets):
    print(idx, dataset, index[idx]['label'])
