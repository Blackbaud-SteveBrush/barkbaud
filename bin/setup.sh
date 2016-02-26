#!/bin/bash

set -o errexit # Exit on error

rm -rf bower_components
rm -rf node_modules
bower install
npm install
grunt build
source .env
npm start --build-database