#!/bin/bash
# The db is instide a docker container, so we need to export it to a file

# Create dump directory if it doesn't exist
mkdir -p ../dump

# Get the container id of the db
CONTAINER_ID=$(docker ps -q --filter "name=db")

if [ -z "$CONTAINER_ID" ]; then
    echo "Error: Could not find container named 'db'"
    exit 1
fi

# Export the database from the container to a temporary location inside the container
echo "Exporting database from container..."
docker exec $CONTAINER_ID pg_dump -U postgres -d postgres -F c -b -v -f /tmp/db.dump

# Copy the dump file from the container to the local dump directory
echo "Copying dump file to local directory..."
docker cp $CONTAINER_ID:/tmp/db.dump ../dump/

# Clean up the temporary file in the container
docker exec $CONTAINER_ID rm /tmp/db.dump

echo "Database export completed successfully!"





