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

terms=["genderidentiteit", "transgenderisme", "transgenders", "vrouwen", "jongeren"]

print (len(data))
newdata=[]

for item in data:

    if 'description' in item:
        if not item['description']:
            continue
        item['description'] = hashsplitter(item['description'])

        newlist=[]
        found=False
        publisher_found=False
        for description in item['description']:
            if description in terms:
                if 'publisher' in item:
                    if not item['publisher']:
                        continue

                    if not publisher_found:
                        publisher=item['publisher']
                        if publisher in counter:
                            counter[publisher] +=1
                            publisher_found=True
                        else:
                            counter[publisher] =1
                            publisher_found=True

                newlist.append(description)
                found=True

            if found:
                item['description']=newlist
                newdata.append(item)

            publisher_found=False

most_common=[i[0] for i in counter.most_common(10)]
print(most_common)
extranewdata=[]
for item in newdata:
    # import pdb; pdb.set_trace()
    if 'publisher' in item:
        if not item['publisher']:
            continue
        # import pdb; pdb.set_trace()
        if item['publisher'] in most_common:
            extranewdata.append(item)


with open('data/dataset_gender-identity.json', 'w') as f:
    f.write(json.dumps(extranewdata))
print(extranewdata)
import pdb; pdb.set_trace()
print (len(extranewdata))