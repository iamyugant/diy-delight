import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import '../App.css'
import CarForm from '../components/CarForm'
import { getCar, updateCar } from '../services/CarsAPI'

const EditCar = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [car, setCar] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        getCar(id).then(setCar).catch(err => setError(err.message))
    }, [id])

    const handleSubmit = async (changes) => {
        await updateCar(id, changes)
        navigate(`/customcars/${id}`)
    }

    if (error) return (
        <div className='page'>
            <p role='alert' className='form-error'>{error}</p>
            <Link to='/customcars' role='button'>Back to all cars</Link>
        </div>
    )
    if (!car) return <p aria-busy='true'>Loading car…</p>

    return (
        <div className='page'>
            <CarForm initial={car} submitLabel='Save' onSubmit={handleSubmit} />
        </div>
    )
}

export default EditCar
