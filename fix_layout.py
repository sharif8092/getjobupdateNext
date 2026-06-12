import sys

with open('src/app/layout.tsx', 'r', encoding='utf-8') as f:
    layout_content = f.read()

layout_content = layout_content.replace(
    "const LiveTicker = dynamic(() => import('@/components/LiveTicker'), { ssr: false });",
    "const LiveTicker = dynamic(() => import('@/components/LiveTicker'));"
)

with open('src/app/layout.tsx', 'w', encoding='utf-8') as f:
    f.write(layout_content)
