import { pool } from './database.js'

export const BASE_PRICE = 65000

// category, name, price, color (hex swatch shown in the picker)
const OPTIONS = [
    ['exterior', 'Black', 0, '#101010'],
    ['exterior', 'Torch Red', 500, '#c1121f'],
    ['exterior', 'Arctic White', 0, '#f1f1f1'],
    ['exterior', 'Silver Flare Metallic', 595, '#b8bcc2'],
    ['exterior', 'Elkhart Lake Blue', 595, '#2a6fb0'],

    ['roof', 'Body Color', 0, '#888888'],
    ['roof', 'Visible Carbon Fiber', 1250, '#1a1a1a'],
    ['roof', 'Carbon Flash - Nacelles', 1695, '#2b2b2b'],
    ['roof', 'Convertible', 7500, '#3a3a3a'],

    ['wheels', 'Edge Blue', 0, '#1e5aa8'],
    ['wheels', 'Satin Graphite with Red Stripe', 1195, '#555555'],
    ['wheels', 'Carbon Flash', 1495, '#222222'],
    ['wheels', 'Carbon Flash with Accelerate Yellow Caliper', 1895, '#e6b800'],

    ['interior', 'Jet Black Interior with Gray Seat', 0, '#3b3b3b'],
    ['interior', 'Adrenaline Red', 1295, '#a4161a'],
    ['interior', 'Natural Dipped', 1595, '#b08968'],
]

// pairs that cannot be built together: [category, name, category, name, reason]
const INCOMPATIBLE = [
    ['roof', 'Convertible', 'wheels', 'Carbon Flash', 'Carbon Flash wheels are only available on the fixed-roof coupe.'],
    ['roof', 'Convertible', 'wheels', 'Carbon Flash with Accelerate Yellow Caliper', 'Carbon Flash wheels are only available on the fixed-roof coupe.'],
    ['roof', 'Convertible', 'interior', 'Natural Dipped', 'Natural Dipped leather is not weather-resistant, so it cannot be paired with a Convertible.'],
]

// sample builds so the list view is not empty: [name, exterior, roof, wheels, interior]
const SAMPLE_CARS = [
    ['Track Day Terror', 'Torch Red', 'Visible Carbon Fiber', 'Carbon Flash with Accelerate Yellow Caliper', 'Adrenaline Red'],
    ['Daily Driver', 'Arctic White', 'Body Color', 'Edge Blue', 'Jet Black Interior with Gray Seat'],
    ['Sunday Cruiser', 'Elkhart Lake Blue', 'Convertible', 'Satin Graphite with Red Stripe', 'Adrenaline Red'],
    ['Stealth Mode', 'Black', 'Carbon Flash - Nacelles', 'Carbon Flash', 'Jet Black Interior with Gray Seat'],
    ['Silver Bullet', 'Silver Flare Metallic', 'Convertible', 'Edge Blue', 'Jet Black Interior with Gray Seat'],
]

const reset = async () => {
    await pool.query(`
        DROP TABLE IF EXISTS custom_items;
        DROP TABLE IF EXISTS incompatible_options;
        DROP TABLE IF EXISTS options;

        CREATE TABLE options (
            id SERIAL PRIMARY KEY,
            category VARCHAR(20) NOT NULL,
            name VARCHAR(50) NOT NULL,
            price INTEGER NOT NULL DEFAULT 0,
            color VARCHAR(9) NOT NULL,
            UNIQUE (category, name)
        );

        CREATE TABLE incompatible_options (
            id SERIAL PRIMARY KEY,
            option_a INTEGER NOT NULL REFERENCES options(id) ON DELETE CASCADE,
            option_b INTEGER NOT NULL REFERENCES options(id) ON DELETE CASCADE,
            reason TEXT NOT NULL
        );

        CREATE TABLE custom_items (
            id SERIAL PRIMARY KEY,
            name VARCHAR(80) NOT NULL,
            exterior_id INTEGER NOT NULL REFERENCES options(id),
            roof_id INTEGER NOT NULL REFERENCES options(id),
            wheels_id INTEGER NOT NULL REFERENCES options(id),
            interior_id INTEGER NOT NULL REFERENCES options(id),
            total_price INTEGER NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
    `)

    for (const [category, name, price, color] of OPTIONS) {
        await pool.query(
            'INSERT INTO options (category, name, price, color) VALUES ($1, $2, $3, $4)',
            [category, name, price, color]
        )
    }

    for (const [catA, nameA, catB, nameB, reason] of INCOMPATIBLE) {
        await pool.query(
            `INSERT INTO incompatible_options (option_a, option_b, reason)
             SELECT a.id, b.id, $5 FROM options a, options b
             WHERE a.category = $1 AND a.name = $2 AND b.category = $3 AND b.name = $4`,
            [catA, nameA, catB, nameB, reason]
        )
    }

    for (const [name, ...names] of SAMPLE_CARS) {
        const categories = ['exterior', 'roof', 'wheels', 'interior']
        const ids = []
        for (let i = 0; i < 4; i++) {
            const { rows } = await pool.query(
                'SELECT id, price FROM options WHERE category = $1 AND name = $2', [categories[i], names[i]]
            )
            if (rows.length === 0) throw new Error(`sample car "${name}": no ${categories[i]} called "${names[i]}"`)
            ids.push(rows[0])
        }
        const total = ids.reduce((sum, o) => sum + o.price, BASE_PRICE)
        await pool.query(
            `INSERT INTO custom_items (name, exterior_id, roof_id, wheels_id, interior_id, total_price)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [name, ...ids.map(o => o.id), total]
        )
    }

    console.log('database reset: tables created and seeded')
    await pool.end()
}

reset().catch(err => {
    console.error('reset failed:', err.message)
    process.exit(1)
})
