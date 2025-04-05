#!/bin/bash

# Check if the dump file exists
if [ ! -f "../dump/db.dump" ]; then
    echo "Error: Database dump file not found at ../dump/db.dump"
    exit 1
fi

# Get the container id of the db
CONTAINER_ID=$(docker ps -q --filter "name=db")

if [ -z "$CONTAINER_ID" ]; then
    echo "Error: Could not find container named 'db'"
    exit 1
fi

# Copy the dump file to the container
echo "Copying dump file to container..."
docker cp ../dump/db.dump $CONTAINER_ID:/tmp/db.dump

# Import the database
echo "Importing database..."
docker exec $CONTAINER_ID pg_restore -U postgres -d postgres -v -c /tmp/db.dump

# Clean up the temporary file in the container
docker exec $CONTAINER_ID rm /tmp/db.dump

echo "Database import completed successfully!"