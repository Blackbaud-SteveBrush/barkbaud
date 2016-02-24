#!/bin/bash

set -o errexit # Exit on error

bower install
grunt build