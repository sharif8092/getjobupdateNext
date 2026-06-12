import sys

with open('src/lib/wordpress.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "name: 'Exams / Admissions'" in line and not line.strip().endswith(','):
        lines[i] = line.rstrip('\n') + ',\n'
        break

with open('src/lib/wordpress.ts', 'w', encoding='utf-8') as f:
    f.writelines(lines)
