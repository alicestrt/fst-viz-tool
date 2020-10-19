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


# terms=[{"homomannen":"other"},"lesbische_vrouwen","coming_out","sexsuele_orientatie","lhbt","homoparen","homojongens","bisexualiteit"]
# terms={"homomannen":["other","otherother"],"lesbische_vrouwen":"something"}
terms={"homomannen":"otherother","lesbische_vrouwen":"something"}
# print(terms["homomannen"])
# for some reason it prints in reverse


# print (len(data))
newdata=[]

for item in data:
    if 'description' in item:
        if not item['description']:
            continue
        item['description'] = hashsplitter(item['description'])

        newlist={}
        # length=len(item['description'])
        found=False
        publisher_found=False
        for description in item['description']:
            if description in terms.keys():
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
                # print (terms[description])
                newlist.update({description:terms[description]})
                # print (newlist)
                found=True
                # print (newlist)

            if found:
                if len(newlist.keys())>=2:
                    item['description_second']=newlist.keys()[1]
                    item['context_second']=newlist.get(newlist.keys()[1])
                else:
                    item['description']=newlist.keys()[0]
                    item['context_first']=newlist.get(newlist.keys()[0])
                # import pdb; pdb.set_trace()
                    # item['description'][0]=terms[description]
                newdata.append(item)
            publisher_found=False
# import pdb; pdb.set_trace()
most_common=[i[0] for i in counter.most_common(40)]
# print(most_common)
extranewdata=[]
for item in newdata:
    # import pdb; pdb.set_trace()
    if 'publisher' in item:
        if not item['publisher']:
            continue
        # import pdb; pdb.set_trace()
        if item['publisher'] in most_common:
            extranewdata.append(item)


with open('data/dataset_sexuality_addcontext.json', 'w') as f:
    f.write(json.dumps(extranewdata))
# print(extranewdata)
# import pdb; pdb.set_trace()
print (len(extranewdata))
