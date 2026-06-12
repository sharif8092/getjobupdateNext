with open('src/lib/wordpress.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i, line in enumerate(lines):
    if 'Exams / Admissions' in line:
        print(repr(line))
