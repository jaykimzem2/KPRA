import os

path = "assets/images/networking"
files = [f for f in os.listdir(path) if f.lower().endswith(('.jpg', '.jpeg', '.png')) and not f.startswith('net')]
html = ""
for i, f in enumerate(files):
    delay = (i % 4) * 50
    html += f'       <div class="gallery-item" data-aos="zoom-in" data-aos-delay="{delay}"><img src="assets/images/networking/{f}" alt="Networking Visual" loading="lazy"></div>\n'

with open("gallery_chunk.html", "w") as out:
    out.write(html)
