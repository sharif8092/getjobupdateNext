import sys

with open('src/lib/wordpress.ts', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    "  { name: 'Exams / Admissions', slug: 'exams', color: 'purple', type: 'aziz_exam', emoji: '🎓' }\n  { name: 'Careers', slug: 'careers', color: 'pink', type: 'aziz_career', emoji: '🎓' },\n",
    "  { name: 'Exams / Admissions', slug: 'exams', color: 'purple', type: 'aziz_exam', emoji: '🎓' },\n  { name: 'Careers', slug: 'careers', color: 'pink', type: 'aziz_career', emoji: '🎓' }\n"
)

with open('src/lib/wordpress.ts', 'w', encoding='utf-8') as f:
    f.write(c)
