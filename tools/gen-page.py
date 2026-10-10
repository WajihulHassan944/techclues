#!/usr/bin/env python3
"""Generate a plain page from a saved copy of the reference page.

usage: gen-page.py <route> <ComponentName> <saved-page.html> <converter-dir>
Downloads missing images, converts <main> to components/<Name>Markup.tsx and writes app/<route>/page.tsx.
"""
import json, os, re, subprocess, sys, urllib.request, urllib.parse

route, name, saved, conv = sys.argv[1:5]
root = os.getcwd()
html = open(saved).read()
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

tmp = f"/tmp/{name}-full.tsx"
subprocess.run(["node", f"{conv}/convert.mjs", saved, f"{conv}/imgmap.json", tmp, name + "Full"], check=True, env={**os.environ, "NODE_PATH": f"{conv}/node_modules"}, stdout=subprocess.DEVNULL)
s = open(tmp).read()
main = s[s.index("<main"): s.index("</main>") + 7]
main = re.sub(r'tabIndex="(-?[0-9]+)"', r"tabIndex={\1}", main)
main = re.sub(r"style=\{\{([^{}]*\"--[^{}]*)\}\}", r"style={{\1} as React.CSSProperties}", main)
open(f"{root}/components/{name}Markup.tsx", "w").write(f'''/* {route} page content, generated from the saved markup. */
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
os.makedirs(f"{root}/app/{route}", exist_ok=True)
open(f"{root}/app/{route}/page.tsx", "w").write(f'''import type {{ Metadata }} from "next";
import {name}Markup from "@/components/{name}Markup";

export const metadata: Metadata = {{
  title: {json.dumps(title, ensure_ascii=False)},
  description:
    {json.dumps(desc, ensure_ascii=False)},
  alternates: {{ canonical: "https://vebryx.co.uk/{route}" }},
}};

export default function Page() {{
  return <{name}Markup />;
}}
''')
print("generated", name + "Markup |", title)
