def next_number():
  inp = input()
  first, second, third = inp.split()
  first, second, third = int(first), int(second), int(third)
  fourth = third + (second-first)
  print(fourth)
  
next_number()

