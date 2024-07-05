li1 = [0,1,2,3,4,5,6]

def even(li):
  li2=[]
  for i in li:
    if (i%2 == 0 and i!=0):
      li2.append(i)
  
  return li2

print(even(li1))

def lamda_even(li):
  return [ num for num in li if num%2 == 0 and num != 0 ]

print(lamda_even(li1))
  