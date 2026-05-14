import os
import glob
import re

for filepath in glob.glob('src/pages/services/*.astro'):
    with open(filepath, 'r') as f:
        content = f.read()
    
    content = re.sub(r'<img src="([^"]+)" class="w-5 h-5" alt="([^"]+)" />', r'<img width="20" height="20" loading="lazy" decoding="async" src="\1" class="w-5 h-5" alt="\2" />', content)
    
    with open(filepath, 'w') as f:
        f.write(content)
print("Done lazy loading update.")
