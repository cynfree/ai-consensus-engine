#!/bin/bash
# deploy-project-genesis.sh

# 1. Create a proper project structure
mkdir -p project-genesis/{public,server,config}
cd project-genesis

# 2. Move client-side files to public directory
mv *.html public/
mv *.js public/  # if any

# 3. Create server directory structure
mkdir -p server/{routes,middleware,controllers}

# 4. Initialize git with proper branching strategy
git init
git checkout -b develop
git add .
git commit -m "Initial project structure"

# 5. Create main branch
git checkout -b main
git merge develop

# 6. Add remote and push
git remote add origin https://github.com/yourusername/project-genesis.git
git push -u origin main
