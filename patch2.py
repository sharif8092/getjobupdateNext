import sys

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('''    yojanas = await getPosts('aziz_yojana', 4);\n    careers = await getPosts('aziz_career', 4);\n    syllabus = await getPosts('aziz_syllabus', 4);''', '''    yojanas = await getPosts('aziz_yojana', 4);\n    syllabus = await getPosts('aziz_syllabus', 4);''')

c = c.replace('''  let yojanas: WordPressPost[] = [];\n  let careers: WordPressPost[] = [];\n  let syllabus: WordPressPost[] = [];''', '''  let yojanas: WordPressPost[] = [];\n  let syllabus: WordPressPost[] = [];''')

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
