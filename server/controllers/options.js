import { pool } from '../config/database.js'

const getExteriorColors = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM exterior_colors ORDER BY name')
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getWheels = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM wheels ORDER BY name')
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getRoofs = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM roofs ORDER BY name')
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getEngines = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM engines ORDER BY name')
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export { getExteriorColors, getWheels, getRoofs, getEngines }