from decimal import Decimal
# s1, s2, s3 = input().split()

# if((Decimal(s1)*Decimal(s2))>int(s3)):
#   print("true")
# else:
#   print("false")


s1, s2 = input().split()

m = Decimal(s1)
v = Decimal(s2)
g=Decimal(0.5)

# print(m,v)

ans= (g*(m*v)) * v

print(int(ans))