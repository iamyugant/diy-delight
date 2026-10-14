// Every call resolves to the parsed JSON body; non-2xx responses throw an Error
// carrying the server's `error` message so pages can show it to the user.
const request = async (url, options) => {
    const response = await fetch(url, options)
    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(data.error || 'Something went wrong.')
    return data
}

const jsonOptions = (method, body) => ({
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
})

export const getAllCars = () => request('/api/customcars')
export const getCar = (id) => request(`/api/customcars/${id}`)
export const createCar = (car) => request('/api/customcars', jsonOptions('POST', car))
export const updateCar = (id, car) => request(`/api/customcars/${id}`, jsonOptions('PATCH', car))
export const deleteCar = (id) => request(`/api/customcars/${id}`, { method: 'DELETE' })
