e = 65537
n = 2336234521
print("Wiener's attack condition: d <", 1/3*n**0.25)

print("e/n =", e/n)
condition = e/n

print()
print("Using Extended Euclid's algorithm,")
q,r = 0,1
convergents = []
while r is not 0:
  q = e//n
  r = e%n
  print("{} = {}*{} + {}".format(e, q, n, r))
  e = n
  n = r
  convergents.append(q)

print()
print("convergents of e/n: ", convergents)
print("Start continued fractions...")
for i in range(1,len(convergents)):
  frac = 0.0
  for j in range(i,-1,-1):
    if j==i:
      frac = convergents[j]
    else:
      frac = convergents[j] + 1/frac
  print('convergent {}: {}'.format(i, frac))
  print('convergent < e/n == {}'.format(frac<condition))