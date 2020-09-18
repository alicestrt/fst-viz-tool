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
    if 'publisher' in item:
        if not item['publisher']:
            continue
        item['publisher'] = hashsplitter(item['publisher'])
        # print(item['publisher'])
        for publisher in item['publisher']:
            if publisher in counter:
                counter[publisher] +=1
            else:
                counter[publisher] =1


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

most_common= [i[0] for i in counter.most_common(100)]
print(most_common)
extranewdata=[]
for item in newdata:
    # import pdb; pdb.set_trace()
    if 'publisher' in item:
        if not item['publisher']:
            continue
        import pdb; pdb.set_trace()
        if item['publisher'] in most_common:
            extranewdata.append(item)


with open('data/dataset_extranewdata.json', 'w') as f:
    f.write(json.dumps(extranewdata))
print (len(extranewdata))
