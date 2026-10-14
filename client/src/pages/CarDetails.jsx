import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import '../App.css'
import CarSpecs, { CarTitle } from '../components/CarSpecs'
import { getCar, deleteCar } from '../services/CarsAPI'

const CarDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [car, setCar] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        getCar(id).then(setCar).catch(err => setError(err.message))
    }, [id])

    const handleDelete = async () => {
        if (!window.confirm(`Delete "${car.name}"? This cannot be undone.`)) return
        try {
            await deleteCar(id)
            navigate('/customcars')
        } catch (err) {
            setError(err.message)
        }
    }

    if (error) return (
        <div className='page'>
            <p role='alert' className='form-error'>{error}</p>
            <Link to='/customcars' role='button'>Back to all cars</Link>
        </div>
    )
    if (!car) return <div className='page'><p aria-busy='true'>Loading car…</p></div>

    return (
        <div className='page'>
            <main className='car-list'>
                <article>
                    <header><CarTitle car={car} /></header>
                    <CarSpecs car={car}>
                        <Link to={`/edit/${car.id}`} role='button'>Edit</Link>
                        <button type='button' onClick={handleDelete}>Delete</button>
                    </CarSpecs>
                    <footer><Link to='/customcars' role='button'>Back to all cars</Link></footer>
                </article>
            </main>
        </div>
    )
}

export default CarDetails
