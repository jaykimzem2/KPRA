import os

path = "assets/images/networking"
files = [f for f in os.listdir(path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
js_array = "const galleryImages = [\n"
for f in files:
    js_array += f"  'assets/images/networking/{f}',\n"
js_array += "];"

with open("gallery_list.js", "w") as out:
    out.write(js_array)
