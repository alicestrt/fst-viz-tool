import os
import json
from pprint import pprint
from collections import Counter

def hashsplitter(item):
    try:
        return item.split(' # ')
    except Exception:
        import pdb; pdb.set_trace()

with open('data/dataset_selection.json', 'r') as f:
    data = json.load(f)

counter = Counter()

terms=["homomannen","lesbische_vrouwen","coming_out","sexsuele_orientatie","lhbt","homoparen","homojongens","bisexualiteit"]

print (len(data))
newdata=[]

for item in data:
    # print (data[i])
    if 'description' in item:
        if not item['description']:
            continue
        item['description'] = hashsplitter(item['description'])
        newlist=[]
        found=False
        for description in item['description']:
            if description in terms:
                newlist.append(description)
                found=True

            if found:
                item['description']=newlist
                newdata.append(item)

# import pdb; pdb.set_trace()

#    if 'free_descriptors' in item:
#        item['free_descriptors'] = hashsplitter(item['free_descriptors'])

with open('data/dataset_newdata.json', 'w') as f:
    f.write(json.dumps(newdata))

# print (len(data))
# print (data[1])
# print (data[6])
for item in newdata:
    for desc in item['description']:
        if desc not in terms:
            import pdb; pdb.set_trace()
            assert False

    # pprint (item['description'])
# pprint(counter.most_common(50))
#pprint([item['free_descriptors'] for item in data])
#pprint([item['description'] for item in data])
