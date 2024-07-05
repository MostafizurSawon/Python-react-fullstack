
tuple = [(1,2),(3,4),(4,5)]
# print(tuple)

def swap_tuple(t):
  new = [(b,a) for a,b in t] 
  return new

print(swap_tuple(tuple))
