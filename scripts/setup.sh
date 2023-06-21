#!/bin/bash
set -e

cd "$(git rev-parse --show-toplevel)"
source 'scripts/mac/create_user_and_db.sh'

cd '../backend'
npm install
npm run create

cd './frontend'
npm install
