import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace colors
content = content.replace('#1a4fa0', '#0342EE')
content = content.replace('#0f3272', '#022F99')
content = content.replace('#fcd116', '#FAC302')

with open('src/App.tsx', 'w') as f:
    f.write(content)
