st = input('Your word: ')

def find_vowel(string):
  v = ('a', 'e', 'i', 'o', 'u')
  count = 0
  for s in string:
    if s.lower() in v:
      count+=1
  
  return count

# method 2





def find_v(string):
  vowels = ('a', 'e', 'i', 'o', 'u')
  return any(v in vowels for v in string)

if (find_vowel(st)):
  print("The string contains a vowel.")
  
else:
  print("The string does not contain any vowel.")
