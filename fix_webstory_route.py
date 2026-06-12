import sys

with open('src/app/web-stories/[slug]/route.ts', 'r', encoding='utf-8') as f:
    route_content = f.read()

# Replace single post fetch with loop
target_types = "['aziz_job', 'aziz_result', 'aziz_admit', 'aziz_answerkey', 'aziz_yojana', 'aziz_syllabus', 'aziz_exam', 'aziz_scholarship', 'aziz_career']"
loop_code = f"""  let post = null;
  const typesToCheck = {target_types};
  for (const t of typesToCheck) {{
    post = await getPostBySlug(t, slug);
    if (post) break;
  }}"""

route_content = route_content.replace(
    "const post = await getPostBySlug('aziz_job', slug);",
    loop_code
)

with open('src/app/web-stories/[slug]/route.ts', 'w', encoding='utf-8') as f:
    f.write(route_content)
