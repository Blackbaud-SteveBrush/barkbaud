#!/bin/bash

echo "Building database..."
mongoimport -h ds011308.mongolab.com:11308 -d barkbaud -c Dog -u stevebrush -p steve883 --file server/database/backups/Dog.json
mongoimport -h ds011308.mongolab.com:11308 -d barkbaud -c DogNotes -u stevebrush -p steve883 --file server/database/backups/DogNotes.json
mongoimport -h ds011308.mongolab.com:11308 -d barkbaud -c DogOwnerHistory -u stevebrush -p steve883 --file server/database/backups/DogOwnerHistory.json