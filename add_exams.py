import sys

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add exams to fetch in SidebarFeed
target_1 = '''  let careers: WordPressPost[] = [];

  try {
    jobs = await getPosts('aziz_job', 4);'''
replacement_1 = '''  let careers: WordPressPost[] = [];
  let exams: WordPressPost[] = [];

  try {
    jobs = await getPosts('aziz_job', 4);
    exams = await getPosts('aziz_exam', 4);'''
content = content.replace(target_1, replacement_1)

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
