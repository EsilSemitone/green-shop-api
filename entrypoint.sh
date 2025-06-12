#!/bin/sh

echo "🔁 Running migrations..."
npx knex migrate:latest --knexfile knexfile.ts 

echo "🚀 Starting app..."
exec node /api/dist/main.js