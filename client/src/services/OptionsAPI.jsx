export const getOptions = async () => {
    const response = await fetch('/api/options')
    if (!response.ok) throw new Error('Could not load options.')
    return response.json()
}

export const getIncompatibilities = async () => {
    const response = await fetch('/api/incompatibilities')
    if (!response.ok) throw new Error('Could not load option rules.')
    return response.json()
}
