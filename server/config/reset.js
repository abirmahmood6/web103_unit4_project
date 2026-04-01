import { pool } from './database.js'

const createTables = async () => {
  try {
    // Drop existing tables
    await pool.query(`
      DROP TABLE IF EXISTS cars CASCADE;
      DROP TABLE IF EXISTS exterior_colors CASCADE;
      DROP TABLE IF EXISTS wheels CASCADE;
      DROP TABLE IF EXISTS roofs CASCADE;
      DROP TABLE IF EXISTS engines CASCADE;
    `)

    // Create options tables
    await pool.query(`
      CREATE TABLE exterior_colors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        hex_color VARCHAR(7) NOT NULL,
        price DECIMAL(10,2) DEFAULT 0
      )
    `)

    await pool.query(`
      CREATE TABLE wheels (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        image_url VARCHAR(255),
        price DECIMAL(10,2) DEFAULT 0
      )
    `)

    await pool.query(`
      CREATE TABLE roofs (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        type VARCHAR(50),
        image_url VARCHAR(255),
        price DECIMAL(10,2) DEFAULT 0
      )
    `)

    await pool.query(`
      CREATE TABLE engines (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        horsepower INTEGER,
        price DECIMAL(10,2) DEFAULT 0
      )
    `)

    // Create cars table
    await pool.query(`
      CREATE TABLE cars (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        base_price DECIMAL(10,2) DEFAULT 25000,
        exterior_color_id INTEGER REFERENCES exterior_colors(id),
        wheels_id INTEGER REFERENCES wheels(id),
        roof_id INTEGER REFERENCES roofs(id),
        engine_id INTEGER REFERENCES engines(id),
        total_price DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log('Tables created successfully')
  } catch (error) {
    console.error('Error creating tables:', error)
  }
}

const seedData = async () => {
  try {
    // Seed exterior colors
    await pool.query(`
      INSERT INTO exterior_colors (name, hex_color, price) VALUES
      ('Midnight Black', '#000000', 0),
      ('Pearl White', '#FFFFFF', 500),
      ('Crimson Red', '#DC143C', 800),
      ('Ocean Blue', '#000080', 600),
      ('Forest Green', '#228B22', 700)
    `)

    // Seed wheels
    await pool.query(`
      INSERT INTO wheels (name, price) VALUES
      ('Standard Alloy', 0),
      ('Sport Rims', 1200),
      ('Premium Chrome', 1800),
      ('Off-Road Tires', 1500)
    `)

    // Seed roofs
    await pool.query(`
      INSERT INTO roofs (name, type, price) VALUES
      ('Solid Roof', 'solid', 0),
      ('Convertible Top', 'convertible', 3000)
    `)

    // Seed engines
    await pool.query(`
      INSERT INTO engines (name, horsepower, price) VALUES
      ('Base 2.0L', 180, 0),
      ('Turbo 2.5L', 250, 3000),
      ('V6 3.0L', 320, 5000),
      ('V8 4.0L', 450, 8000)
    `)

    console.log('Data seeded successfully')
  } catch (error) {
    console.error('Error seeding data:', error)
  }
}

const resetDatabase = async () => {
  await createTables()
  await seedData()
  pool.end()
}

resetDatabase()