#!/bin/sh

PRIVATE_KEY="$1"
USERNAME="$2"
HOST="$3"
REMOTE_PATH="$4"

# Build the project
yarn run build

# Copy environment and package files
cp .env.production dist/.env
cp package.json dist/package.json

# Use rsync to copy files (fixed quoting issue)
rsync -av -e "ssh -i $PRIVATE_KEY -o StrictHostKeyChecking=no" ./dist/. "$USERNAME@$HOST:$REMOTE_PATH"


# SSH into the server and run commands
ssh -o StrictHostKeyChecking=no -i "$PRIVATE_KEY" "$USERNAME@$HOST" << EOF
    cd $REMOTE_PATH
    source ~/.nvm/nvm.sh
    if [ "$CHECK_CHANGES" == "true" ]; then
        npm install
    else
        echo "No changes in package.json. Skipping npm install."
    fi
    echo "Installation Done"
    pm2 reload /home/ubuntu/ecosystem.json
    echo "Successfully restarted the admin api"
EOF

