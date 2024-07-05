li = ["html", "css", "js", "react", "redux", "sql", "python", "django"]

def reverse_string(list):
  # method 1
  # li2 = []
  # for l in list:
  #   li2.append(l[::-1])
  # return li2
  
  # method 2
  li2= [l[::-1] for l in list]
  return li2
  
  
    
print(reverse_string(li))