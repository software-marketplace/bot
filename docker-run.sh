#!/bin/bash

if [[ ! -f .env ]]; then
    echo "Missing .env file"
    exit 1
fi

if [[ ! -f smp-bot.private-key.pem ]]; then
    echo "Missing smp-bot.private-key.pem file"
    exit 1
fi


docker run -itd --rm -p 3000:3000 \
    -v ./smp-bot.private-key.pem:/usr/src/smp-bot.private-key.pem \
    -l smp-bot \
    --env-file .env \
    --network developer-service_default \
    -e PRIVATE_KEY_PATH=/usr/src/smp-bot.private-key.pem smp/bot
