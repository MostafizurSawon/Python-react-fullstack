d1 = {"a":1, "b":2} 
d2 = {"b":1, "d":2} 

# print(d1)

def merge_dict(d1,d2):  # merge 2 dic || if same key then will update with second value
  mer = d1.copy()
  mer.update(d2)

  return mer

print(merge_dict(d1,d2))

