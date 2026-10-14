import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import CarSpecs, { CarTitle } from '../components/CarSpecs'
import { getAllCars, deleteCar } from '../services/CarsAPI'

const ViewCars = () => {
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        getAllCars().then(setCars).catch(err => setError(err.message)).finally(() => setLoading(false))
    }, [])

    const handleDelete = async (car) => {
        if (!window.confirm(`Delete "${car.name}"? This cannot be undone.`)) return
        try {
            await deleteCar(car.id)
            setCars(prev => prev.filter(c => c.id !== car.id))
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className='page'>
            {error && <p role='alert' className='form-error'>{error}</p>}
            {loading && <p aria-busy='true'>Loading cars…</p>}
            {!loading && cars.length === 0 && (
                <article>
                    <h3>No cars yet</h3>
                    <p>Build your first custom car to see it here.</p>
                    <Link to='/' role='button'>Customize a car</Link>
                </article>
            )}
            <main className='car-list'>
                {cars.map(car => (
                    <article key={car.id}>
                        <header><CarTitle car={car} /></header>
                        <CarSpecs car={car}>
                            <Link to={`/customcars/${car.id}`} role='button'>Details</Link>
                            <Link to={`/edit/${car.id}`} role='button'>Edit</Link>
                            <button type='button' onClick={() => handleDelete(car)}>Delete</button>
                        </CarSpecs>
                    </article>
                ))}
            </main>
        </div>
    )
}

export default ViewCars
