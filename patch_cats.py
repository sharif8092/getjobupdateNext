import sys

with open('src/lib/wordpress.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    new_lines.append(line)
    if "name: 'Exams / Admissions'" in line:
        new_lines.append("  { name: 'Careers', slug: 'careers', color: 'pink', type: 'aziz_career', emoji: '🎓' },\n")

with open('src/lib/wordpress.ts', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
