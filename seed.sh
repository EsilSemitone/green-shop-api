echo "🌱 Running seeders..."
npx knex migrate:latest
npx knex seed:run --specific=payment-methods.ts
npx knex seed:run --specific=tags.ts
npx knex seed:run --specific=products.ts
npx knex seed:run --specific=product-variants.ts
npx knex seed:run --specific=product-variant-tags.ts