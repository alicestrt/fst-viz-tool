import os
import json
from pprint import pprint
from collections import Counter

def hashsplitter(item):
    try:
        return item.split(' # ')
    except Exception:
        import pdb; pdb.set_trace()

with open('dataset_selection.json', 'r') as f:
    data = json.load(f)

counter = Counter()
for item in data:
    if 'free_descriptors' in item:
        if not item['free_descriptors']:
            continue
        item['free_descriptors'] = hashsplitter(item['free_descriptors'])
        for description in item['free_descriptors']:
            if description in counter:
                counter[description] += 1
            else:
                counter[description] = 1


#    if 'free_descriptors' in item:
#        item['free_descriptors'] = hashsplitter(item['free_descriptors'])

with open('dataset_small_parsed.json', 'w') as f:
    f.write(json.dumps(data))

pprint(counter.most_common(100))
#pprint([item['free_descriptors'] for item in data])
#pprint([item['description'] for item in data])
