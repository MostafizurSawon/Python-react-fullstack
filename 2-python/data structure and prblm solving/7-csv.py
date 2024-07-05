import csv 

with open('data.csv', 'r') as f:
  reader = csv.reader(f)
  for word in reader:
    print(word)
    
with open('data2.csv', 'w') as f:
  writer = csv.writer(f)
  writer.writerow([1,2])
  writer.writerow([2,7,'g'])