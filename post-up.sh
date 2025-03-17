#!/bin/bash

echo "🚀 Running Prisma migrations..."

if ! command -v npx &> /dev/null; then
  echo "❌ Error: npx is not installed. Please install Node.js and npm."
  exit 1
fi

npx prisma migrate deploy

if [ $? -eq 0 ]; then
  echo "✅ Prisma migrations completed successfully."
else
  echo "❌ Error: Failed to execute Prisma migrations."
  exit 1
fi

echo "🛠️ Starting the application server..."
exec yarn start:dev