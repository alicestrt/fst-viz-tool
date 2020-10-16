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

<<<<<<< HEAD:json_cleaner_sexuality_addcontext.py
# terms=[{"homomannen":"other"},"lesbische_vrouwen","coming_out","sexsuele_orientatie","lhbt","homoparen","homojongens","bisexualiteit"]
terms={"homomannen":["other","otherother"],"lesbische_vrouwen":"something"}
# print(terms["homomannen"])
# for some reason it prints in reverse
=======
terms=["seksuele_identiteit", "seksuele_oriëntatie", "seksuele_minderheden", "biseksuelen", "homomannen", "lesbische_vrouwen", "LHBTI"]
publisher_cleaner=["s.n.", "s.n.]", "[s.n.]", "s.n.] "]
>>>>>>> 022cdf1e514acb9b2f2923f55fd22a2c17486d36:json_cleaner_sexuality.py

# print (len(data))
newdata=[]

for item in data:
    if 'description' in item:
        if not item['description']:
            continue
        item['description'] = hashsplitter(item['description'])

        newlist=[]
        # length=len(item['description'])
        found=False
        publisher_found=False
        for description in item['description']:
<<<<<<< HEAD:json_cleaner_sexuality_addcontext.py
            if description in terms.keys():
                i=0
                if 'publisher' in item:
=======
            if description in terms:
                if 'publisher' in item and item['publisher'] not in publisher_cleaner:
>>>>>>> 022cdf1e514acb9b2f2923f55fd22a2c17486d36:json_cleaner_sexuality.py
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
<<<<<<< HEAD:json_cleaner_sexuality_addcontext.py
                # print (terms[description])
=======

>>>>>>> 022cdf1e514acb9b2f2923f55fd22a2c17486d36:json_cleaner_sexuality.py
                newlist.append(description)
                # print (newlist)
                newlist[i][description][0]=terms[description]
                i=i+1
                found=True

            if found:
                if len(newlist) >=2:
                    item['description_second']=newlist[1]
                else:
                    item['description']=newlist[0]
                # print (newlist[0])
                newdata.append(item)

            publisher_found=False

most_common=[i[0] for i in counter.most_common(40)]
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


with open('data/dataset_sexuality2.json', 'w') as f:
    f.write(json.dumps(extranewdata))
# print(extranewdata)
# import pdb; pdb.set_trace()
print (len(extranewdata))
