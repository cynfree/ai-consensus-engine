#!/bin/bash
# robust-git-workflow.sh

# 1. Always start with fetching latest changes
git fetch origin

# 2. Check if local branch is behind remote
BEHIND=$(git rev-list --count HEAD..origin/main)
if [ "$BEHIND" -gt 0 ]; then
    echo "Your branch is $BEHIND commits behind. Pulling changes..."
    git pull origin main --rebase
fi

# 3. Add and commit your changes
git add .
git commit -m "Your commit message"

# 4. Push changes
git push origin main

# 5. Clean up repository monthly
git gc --auto
