import { pool } from '../config/database.js'

const BASE_PRICE = 65000
const MAX_NAME_LENGTH = 80

// Never leak raw database messages to the client.
const serverError = (res, error) => {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong on our end. Please try again.' })
}

const isValidId = (id) => /^\d+$/.test(id) && Number(id) <= 2147483647

const FEATURES = ['exterior_id', 'roof_id', 'wheels_id', 'interior_id']
const CATEGORY_OF = { exterior_id: 'exterior', roof_id: 'roof', wheels_id: 'wheels', interior_id: 'interior' }

const SELECT_ITEMS = `
    SELECT c.*,
           ex.name AS exterior, ex.color AS exterior_color,
           ro.name AS roof, ro.color AS roof_color,
           wh.name AS wheels, wh.color AS wheels_color,
           it.name AS interior, it.color AS interior_color
    FROM custom_items c
    JOIN options ex ON ex.id = c.exterior_id
    JOIN options ro ON ro.id = c.roof_id
    JOIN options wh ON wh.id = c.wheels_id
    JOIN options it ON it.id = c.interior_id
`

// Returns { error, status } for a bad submission, or { total } when it is buildable.
const checkBuild = async (body) => {
    const name = (body.name || '').trim()
    if (!name) return { status: 400, error: 'Please give your car a name.' }
    if (name.length > MAX_NAME_LENGTH) {
        return { status: 400, error: `Car names can be at most ${MAX_NAME_LENGTH} characters.` }
    }

    const ids = FEATURES.map(f => Number(body[f]))
    if (ids.some(id => !Number.isInteger(id))) {
        return { status: 400, error: 'Please choose an option for every feature.' }
    }

    const { rows: chosen } = await pool.query(
        'SELECT id, price, category FROM options WHERE id = ANY($1)', [ids]
    )
    const fitsSlot = FEATURES.every((feature, i) =>
        chosen.find(o => o.id === ids[i])?.category === CATEGORY_OF[feature]
    )
    if (!fitsSlot) {
        return { status: 400, error: 'One or more selected options do not exist.' }
    }

    const { rows: conflicts } = await pool.query(
        'SELECT reason FROM incompatible_options WHERE option_a = ANY($1) AND option_b = ANY($1)',
        [ids]
    )
    if (conflicts.length > 0) {
        return { status: 400, error: `Impossible combination: ${conflicts[0].reason}` }
    }

    const total = ids.reduce(
        (sum, id) => sum + chosen.find(o => o.id === id).price, BASE_PRICE
    )
    return { total, name, ids }
}

export const getCustomItems = async (req, res) => {
    try {
        const { rows } = await pool.query(`${SELECT_ITEMS} ORDER BY c.id DESC`)
        res.status(200).json(rows)
    } catch (error) {
        serverError(res, error)
    }
}

export const getCustomItem = async (req, res) => {
    if (!isValidId(req.params.id)) return res.status(404).json({ error: 'Car not found.' })
    try {
        const { rows } = await pool.query(`${SELECT_ITEMS} WHERE c.id = $1`, [req.params.id])
        if (rows.length === 0) return res.status(404).json({ error: 'Car not found.' })
        res.status(200).json(rows[0])
    } catch (error) {
        serverError(res, error)
    }
}

export const createCustomItem = async (req, res) => {
    try {
        const build = await checkBuild(req.body)
        if (build.error) return res.status(build.status).json({ error: build.error })

        const { rows } = await pool.query(
            `INSERT INTO custom_items (name, exterior_id, roof_id, wheels_id, interior_id, total_price)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            [build.name, ...build.ids, build.total]
        )
        res.status(201).json(rows[0])
    } catch (error) {
        serverError(res, error)
    }
}

export const updateCustomItem = async (req, res) => {
    if (!isValidId(req.params.id)) return res.status(404).json({ error: 'Car not found.' })
    try {
        const build = await checkBuild(req.body)
        if (build.error) return res.status(build.status).json({ error: build.error })

        const { rows } = await pool.query(
            `UPDATE custom_items
             SET name = $1, exterior_id = $2, roof_id = $3, wheels_id = $4, interior_id = $5, total_price = $6
             WHERE id = $7 RETURNING id`,
            [build.name, ...build.ids, build.total, req.params.id]
        )
        if (rows.length === 0) return res.status(404).json({ error: 'Car not found.' })
        res.status(200).json(rows[0])
    } catch (error) {
        serverError(res, error)
    }
}

export const deleteCustomItem = async (req, res) => {
    if (!isValidId(req.params.id)) return res.status(404).json({ error: 'Car not found.' })
    try {
        const { rows } = await pool.query(
            'DELETE FROM custom_items WHERE id = $1 RETURNING id', [req.params.id]
        )
        if (rows.length === 0) return res.status(404).json({ error: 'Car not found.' })
        res.status(200).json(rows[0])
    } catch (error) {
        serverError(res, error)
    }
}
