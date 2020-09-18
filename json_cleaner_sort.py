import os
import json
from pprint import pprint
from collections import Counter

def hashsplitter(item):
    try:
        return item.split(' # ')
    except Exception:
        import pdb; pdb.set_trace()

with open('dataset_small.json', 'r') as f:
    data = json.load(f)

counter = Counter()
for item in data:
    if 'description' in item:
        if not item['description']:
            continue
        item['description'] = hashsplitter(item['description'])
        for description in item['description']:
            if description == "homomannen" or description =="lesbische_vrouwen" or description =="coming_out" or description =="sexsuele_orientatie" or description =="lhbt" or description =="homoparen" or description =="homojongens" or description=="bisexualiteit":
                print (description)
                if description in counter:
                    counter[description] += 1
                else:
                    counter[description] = 1


#    if 'free_descriptors' in item:
#        item['free_descriptors'] = hashsplitter(item['free_descriptors'])

with open('dataset_small_parsed_selection.json', 'w') as f:
    f.write(json.dumps(data))

pprint(counter.most_common(50))
#pprint([item['free_descriptors'] for item in data])
#pprint([item['description'] for item in data])
