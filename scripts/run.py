start = 1
current = start 
total = 0 
for x in range(0, 5000): 
	if x % 100 == 0: 
		current = start + (x / 100.0)
	else: 
		current = current + 1.002
	total += current

print (total)