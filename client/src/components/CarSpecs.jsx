import React from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../utilities/calcprice'

// Card body shared by the list and detail pages (joined custom_items row).
const CarSpecs = ({ car, children }) => (
    <div className='car-card'>
        <div className='car-summary'>
            <p><strong>🖌️ Exterior:</strong> {car.exterior}</p>
            <p><strong>😎 Roof:</strong> {car.roof}</p>
        </div>
        <div className='car-summary'>
            <p><strong>🛴 Wheels:</strong> {car.wheels}</p>
            <p><strong>💺 Interior:</strong> {car.interior}</p>
        </div>
        <div className='car-price'>
            <p>💰 {formatPrice(car.total_price)}</p>
            {children}
        </div>
    </div>
)

export const CarTitle = ({ car }) => <h3>🚗 &nbsp;{car.name}</h3>

export default CarSpecs
