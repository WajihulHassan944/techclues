#!/usr/bin/env python3
"""Generate a service detail page from a saved copy of the reference page.

usage: gen-service-page.py <slug> <saved-page.html> <converter-dir>

Converts the saved page's <main> to a React component (components/<Name>Markup.tsx),
downloads any missing images, registers the FAQ in lib/service-faqs.ts and writes the route.
"""
import json, os, re, subprocess, sys, urllib.request

slug, saved, conv = sys.argv[1], sys.argv[2], sys.argv[3]
root = os.getcwd()
name = "".join(p.capitalize() for p in slug.split("-"))
html = open(saved).read()

# 1. images referenced by the page -> public/images/<path> (industries keep their own folder)
mapping = json.load(open(f"{conv}/imgmap.json"))
for enc in sorted(set(re.findall(r"url=([^&\"]+)", html))):
    path = urllib.parse.unquote(enc)
    if path in mapping:
        continue
    local = path if path.startswith("/industries/") else "/images" + path
    dest = root + "/public" + local
    if not os.path.exists(dest):
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        urllib.request.urlretrieve("https://vebryx.co.uk" + path, dest)
        print("downloaded", path)
    mapping[path] = local
json.dump(mapping, open(f"{conv}/imgmap.json", "w"), indent=1)

# 2. convert the page
tmp = f"/tmp/{slug}-full.tsx"
subprocess.run(["node", f"{conv}/convert.mjs", saved, f"{conv}/imgmap.json", tmp, name + "Full"], check=True, env={**os.environ, "NODE_PATH": f"{conv}/node_modules"}, stdout=subprocess.DEVNULL)
s = open(tmp).read()
main = s[s.index("<main"): s.index("</main>") + 7]
main = re.sub(r'tabIndex="(-?[0-9]+)"', r"tabIndex={\1}", main)
main = re.sub(r"style=\{\{([^{}]*\"--[^{}]*)\}\}", r"style={{\1} as React.CSSProperties}", main)

def sub(old, new):
    global main
    assert old in main, "missing: " + old[:90]
    main = main.replace(old, new, 1)

css = lambda d, y=None: '{{"--d": "%s"%s} as React.CSSProperties}' % (d, ', "--y": "%s"' % y if y else "")
sub('<nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[14px] text-muted">', '<nav aria-label="Breadcrumb" className="svc-in flex items-center gap-1.5 text-[14px] text-muted" style=' + css("0s", "10px") + ">")
sub('<span className="block" style={{transform: "translateY(105%)"}}>', '<span className="svc-rise block" style=' + css("0.1s") + ">")
sub('<div className="flex flex-col items-center">', '<div className="svc-in flex flex-col items-center" style=' + css("0.3s", "16px") + ">")
sub('<div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-ink sm:aspect-auto sm:h-[clamp(280px,52vh,560px)] sm:rounded-[36px]">', '<div className="svc-in relative aspect-[4/3] overflow-hidden rounded-[24px] bg-ink sm:aspect-auto sm:h-[clamp(280px,52vh,560px)] sm:rounded-[36px]" style=' + css("0.45s", "30px") + ">")

# 3. FAQ: only the list inside the Questions section
q = main.index('aria-label="Questions"')
f0 = main.index('<ul className="border-t border-ink/10">', q)
f1 = main.index("</ul>", f0) + 5
n_buttons = main[f0:f1].count("<button")
main = main[:f0] + '<Accordion items={serviceFaqs["%s"]} />' % slug + main[f1:]

m = re.search(r'"@type": ?"FAQPage".*?\}\s*\]\s*\}', html, re.S)
qa = re.findall(r'"name": ?"((?:[^"\\]|\\.)*)",\s*"acceptedAnswer": ?\{\s*"@type": ?"Answer",\s*"text": ?"((?:[^"\\]|\\.)*)"', m.group(0))
items = [{"q": json.loads('"' + a + '"'), "a": json.loads('"' + b + '"')} for a, b in qa]
assert len(items) == n_buttons, (len(items), n_buttons)
faq_path = root + "/lib/service-faqs.ts"
faq = open(faq_path).read()
if f'"{slug}":' not in faq:
    entry = f'  "{slug}": ' + json.dumps(items, indent=4, ensure_ascii=False).replace("\n", "\n  ") + ",\n"
    faq = faq.replace("\n};\n", "\n" + entry + "};\n")
    open(faq_path, "w").write(faq)

# 4. component + route
open(f"{root}/components/{name}Markup.tsx", "w").write(f'''/* {slug} service page content, generated from the saved markup. */
import Accordion from "./Accordion";
import {{ serviceFaqs }} from "@/lib/service-faqs";

export default function {name}Markup() {{
  return (
    <>
{main}
    </>
  );
}}
''')
title = re.search(r"<title>([^<]*)</title>", html).group(1).replace("&amp;", "&")
desc = re.search(r'<meta name="description" content="([^"]*)"', html).group(1).replace("&amp;", "&")
os.makedirs(f"{root}/app/services/{slug}", exist_ok=True)
open(f"{root}/app/services/{slug}/page.tsx", "w").write(f'''import type {{ Metadata }} from "next";
import {name}Markup from "@/components/{name}Markup";

export const metadata: Metadata = {{
  title: {json.dumps(title, ensure_ascii=False)},
  description:
    {json.dumps(desc, ensure_ascii=False)},
  alternates: {{ canonical: "https://vebryx.co.uk/services/{slug}" }},
}};

export default function Page() {{
  return <{name}Markup />;
}}
''')
print("generated", name + "Markup", "| faq items", len(items), "| title:", title)
