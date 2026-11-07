# Dumps a .docx as plain text: paragraphs (with style names) and tables, in order. Stdlib only.
import sys, zipfile, xml.etree.ElementTree as ET
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
z = zipfile.ZipFile(sys.argv[1]); body = ET.fromstring(z.read("word/document.xml")).find(W + "body")
def text(el): return "".join(t.text or "" for t in el.iter(W + "t"))
out = []
for el in body:
    if el.tag == W + "p":
        st = el.find(f"{W}pPr/{W}pStyle"); s = st.get(W + "val") if st is not None else ""
        t = text(el).strip()
        if t: out.append(f"[{s}] {t}" if s else t)
    elif el.tag == W + "tbl":
        for row in el.iter(W + "tr"):
            out.append(" | ".join(text(c).strip() for c in row.iter(W + "tc")))
        out.append("")
open(sys.argv[2], "w", encoding="utf-8").write("\n".join(out))
print(len(out), "blocks")
