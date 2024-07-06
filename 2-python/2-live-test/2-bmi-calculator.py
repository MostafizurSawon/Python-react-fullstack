


def bmi():
  h = input("Your height in meter and wight in kg: ")
  height, weight = h.split()
  height = float(height)
  weight = float(weight)
  return weight/(height**2)
  
bmi = bmi()

if bmi < 18.5:
  print(f"BMI: {bmi:.2f}\nUnderweight") 
  
elif bmi >= 18.5 and bmi < 25.0:
  print(f"BMI: {bmi:.2f}\nNormal weight") 
  
elif bmi >= 25.0 and bmi < 30.0:
  print(f"BMI: {bmi:.2f}\nOverweight") 
  
else:
  print(f"BMI: {bmi:.2f}\nObese")