const { PrismaClient } = require('@prisma/client');

async function applySchema() {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    console.log('Connecting to database...');
    await prisma.$connect();

    console.log('Creating schema...');
    // Try creating tables one by one
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        raw_user_meta_data JSONB NOT NULL
      );
    `;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        grid_data JSONB NOT NULL,
        hints JSONB,
        is_public BOOLEAN DEFAULT FALSE,
        owner_id TEXT NOT NULL REFERENCES users(id)
      );
    `;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS project_collaborators (
        project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
        user_id TEXT REFERENCES users(id),
        added_at TIMESTAMPTZ DEFAULT NOW(),
        added_by TEXT REFERENCES users(id),
        PRIMARY KEY (project_id, user_id)
      );
    `;

    console.log('Schema created successfully!');
  } catch (error) {
    console.error('Failed to create schema:', error);
  } finally {
    await prisma.$disconnect();
  }
}

applySchema();
