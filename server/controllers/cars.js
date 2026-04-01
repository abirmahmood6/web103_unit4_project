import { pool } from '../config/database.js'

const getAllCars = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*,
             ec.name as exterior_color_name, ec.hex_color, ec.price as exterior_price,
             w.name as wheels_name, w.price as wheels_price,
             r.name as roof_name, r.type as roof_type, r.price as roof_price,
             e.name as engine_name, e.horsepower, e.price as engine_price
      FROM cars c
      LEFT JOIN exterior_colors ec ON c.exterior_color_id = ec.id
      LEFT JOIN wheels w ON c.wheels_id = w.id
      LEFT JOIN roofs r ON c.roof_id = r.id
      LEFT JOIN engines e ON c.engine_id = e.id
      ORDER BY c.created_at DESC
    `)
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getCarById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(`
      SELECT c.*,
             ec.name as exterior_color_name, ec.hex_color, ec.price as exterior_price,
             w.name as wheels_name, w.price as wheels_price,
             r.name as roof_name, r.type as roof_type, r.price as roof_price,
             e.name as engine_name, e.horsepower, e.price as engine_price
      FROM cars c
      LEFT JOIN exterior_colors ec ON c.exterior_color_id = ec.id
      LEFT JOIN wheels w ON c.wheels_id = w.id
      LEFT JOIN roofs r ON c.roof_id = r.id
      LEFT JOIN engines e ON c.engine_id = e.id
      WHERE c.id = $1
    `, [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Car not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const createCar = async (req, res) => {
  try {
    const { name, exterior_color_id, wheels_id, roof_id, engine_id } = req.body

    // Validate required fields
    if (!name || !exterior_color_id || !wheels_id || !roof_id || !engine_id) {
      return res.status(400).json({ error: 'All customization options are required' })
    }

    // Calculate total price
    const basePrice = 25000
    const optionsResult = await pool.query(`
      SELECT
        (SELECT price FROM exterior_colors WHERE id = $1) as exterior_price,
        (SELECT price FROM wheels WHERE id = $2) as wheels_price,
        (SELECT price FROM roofs WHERE id = $3) as roof_price,
        (SELECT price FROM engines WHERE id = $4) as engine_price
    `, [exterior_color_id, wheels_id, roof_id, engine_id])

    const { exterior_price, wheels_price, roof_price, engine_price } = optionsResult.rows[0]
    const totalPrice = basePrice + parseFloat(exterior_price) + parseFloat(wheels_price) + parseFloat(roof_price) + parseFloat(engine_price)

    const result = await pool.query(`
      INSERT INTO cars (name, exterior_color_id, wheels_id, roof_id, engine_id, total_price)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [name, exterior_color_id, wheels_id, roof_id, engine_id, totalPrice])

    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const updateCar = async (req, res) => {
  try {
    const { id } = req.params
    const { name, exterior_color_id, wheels_id, roof_id, engine_id } = req.body

    // Check if car exists
    const carCheck = await pool.query('SELECT * FROM cars WHERE id = $1', [id])
    if (carCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Car not found' })
    }

    // Validate required fields
    if (!name || !exterior_color_id || !wheels_id || !roof_id || !engine_id) {
      return res.status(400).json({ error: 'All customization options are required' })
    }

    // Calculate total price
    const basePrice = 25000
    const optionsResult = await pool.query(`
      SELECT
        (SELECT price FROM exterior_colors WHERE id = $1) as exterior_price,
        (SELECT price FROM wheels WHERE id = $2) as wheels_price,
        (SELECT price FROM roofs WHERE id = $3) as roof_price,
        (SELECT price FROM engines WHERE id = $4) as engine_price
    `, [exterior_color_id, wheels_id, roof_id, engine_id])

    const { exterior_price, wheels_price, roof_price, engine_price } = optionsResult.rows[0]
    const totalPrice = basePrice + parseFloat(exterior_price) + parseFloat(wheels_price) + parseFloat(roof_price) + parseFloat(engine_price)

    const result = await pool.query(`
      UPDATE cars
      SET name = $1, exterior_color_id = $2, wheels_id = $3, roof_id = $4, engine_id = $5, total_price = $6
      WHERE id = $7
      RETURNING *
    `, [name, exterior_color_id, wheels_id, roof_id, engine_id, totalPrice, id])

    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const deleteCar = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('DELETE FROM cars WHERE id = $1 RETURNING *', [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Car not found' })
    }

    res.json({ message: 'Car deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export { getAllCars, getCarById, createCar, updateCar, deleteCar }