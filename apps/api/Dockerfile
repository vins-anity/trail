FROM oven/bun:1.2.2

WORKDIR /app

# Copy root configs
COPY package.json bun.lock turbo.json tsconfig.json biome.json ./

# Copy packages
COPY packages ./packages

# Copy apps
COPY apps/api ./apps/api
# We don't need apps/web for the API container

# Install dependencies (from root)
RUN bun install

# Build shared packages if necessary (or just run from source with Bun)
# RUN bun run build --filter=shared

# Expose API port
EXPOSE 3000

# Default command (overridden by Render)
CMD ["bun", "run", "apps/api/src/index.ts"]
