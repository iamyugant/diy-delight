import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'
import CarForm from '../components/CarForm'
import { createCar } from '../services/CarsAPI'

const CreateCar = () => {
    const navigate = useNavigate()

    const handleSubmit = async (car) => {
        const { id } = await createCar(car)
        navigate(`/customcars/${id}`)
    }

    return (
        <div className='page'>
            <CarForm submitLabel='Create' onSubmit={handleSubmit} />
        </div>
    )
}

export default CreateCar
