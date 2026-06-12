import sys

# 1. Remove from page.tsx
with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    page_content = f.read()

page_content = page_content.replace('        <LiveTicker />\n\n', '')
page_content = page_content.replace('        <LiveTicker />\n', '')
# also remove the dynamic import from page.tsx
page_import_target = 'const LiveTicker = dynamic(() => import(\'@/components/LiveTicker\'), { loading: () => <div className="h-[46px] bg-black border-b border-white/10 flex items-center px-4 overflow-hidden"><div className="flex gap-2 items-center w-full max-w-[1200px] mx-auto animate-pulse"><div className="w-16 h-5 bg-white/10 rounded"></div><div className="flex-1 flex gap-4 overflow-hidden"><div className="w-48 h-4 bg-white/5 rounded"></div></div></div></div> });\n'
page_content = page_content.replace(page_import_target, '')

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(page_content)

# 2. Add to layout.tsx
with open('src/app/layout.tsx', 'r', encoding='utf-8') as f:
    layout_content = f.read()

layout_import = '''const FloatingSocial = dynamic(() => import('@/components/FloatingSocial'));
const LiveTicker = dynamic(() => import('@/components/LiveTicker'), { ssr: false });
'''
layout_content = layout_content.replace("const FloatingSocial = dynamic(() => import('@/components/FloatingSocial'));\n", layout_import)

layout_placement = '''        <OneSignalInit />
        <LiveTicker />
        <Navbar />'''
layout_content = layout_content.replace("        <OneSignalInit />\n        <Navbar />", layout_placement)

with open('src/app/layout.tsx', 'w', encoding='utf-8') as f:
    f.write(layout_content)

# 3. Modify LiveTicker.tsx
with open('src/components/LiveTicker.tsx', 'r', encoding='utf-8') as f:
    ticker_content = f.read()

ticker_import = '''import { usePathname } from 'next/navigation';
import { POST_TYPE_MAP } from '@/lib/wordpress';'''
ticker_content = ticker_content.replace("import { POST_TYPE_MAP } from '@/lib/wordpress';", ticker_import)

ticker_logic = '''export default function LiveTicker() {
  const pathname = usePathname();
  const [posts, setPosts] = useState<TickerPost[]>([]);

  useEffect(() => {'''
ticker_content = ticker_content.replace('''export default function LiveTicker() {
  const [posts, setPosts] = useState<TickerPost[]>([]);

  useEffect(() => {''', ticker_logic)

ticker_return_null = '''  if (pathname !== '/') return null;

  if (posts.length === 0) {'''
ticker_content = ticker_content.replace('''  if (posts.length === 0) {''', ticker_return_null)

with open('src/components/LiveTicker.tsx', 'w', encoding='utf-8') as f:
    f.write(ticker_content)

