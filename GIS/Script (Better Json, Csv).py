def main(data):
    columnas = []
    for fila in data:
        keys = list(fila.keys())
        for key in keys:
            if key not in columnas:
                columnas.append(key)
    
    csv = open("test.csv", 'w')
    
    for key in columnas:
        if columnas[-1] == key:
            csv.write(f"{key}\n")
        else:
            csv.write(f"{key}, ")
    err = 0
    for fila in data:
        
        for key in columnas:
            try:
                if fila[key] and (fila[key] != "" or fila[key] != " "):
                    if columnas[-1] == key:
                        csv.write(f"{(fila[key]).replace(',', ' ')}\n")
                    else:
                        csv.write(f"{fila[key].replace(',', ' ')}, ")
                else:
                    if columnas[-1] == key:
                        csv.write(f"Nn\n")
                    else:
                        csv.write(f"Nn, ")
            except:
                if columnas[-1] == key:
                    csv.write(f"Nn\n")
                else:
                    csv.write(f"Nn, ")
                continue

data = eval(open("/content/DataPrincipal.json", "r").read())

main(data)
print(len(data))

print(len(open("test.csv", "r").readlines()))

