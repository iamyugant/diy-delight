import { pool } from '../config/database.js'

export const getOptions = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM options ORDER BY id')
        res.status(200).json(rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Could not load options.' })
    }
}

export const getIncompatibilities = async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT option_a, option_b, reason FROM incompatible_options ORDER BY id'
        )
        res.status(200).json(rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Could not load options.' })
    }
}
