# 1. Pull the latest changes and merge them
git pull origin main

# If you encounter the "unrelated histories" error during pull:
git pull origin main --allow-unrelated-histories

# 2. Resolve any merge conflicts if they exist
# (Git will prompt you to edit conflicted files)

# 3. After resolving conflicts, add and commit
git add .
git commit -m "Merge remote changes with local changes"

# 4. Now push your changes
git push origin main
