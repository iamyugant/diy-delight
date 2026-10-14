export const BASE_PRICE = 65000
export const CATEGORIES = ['exterior', 'roof', 'wheels', 'interior']

// selection looks like { exterior_id, roof_id, wheels_id, interior_id }
export const calcTotal = (selection, options) =>
    CATEGORIES.reduce((sum, category) => {
        const option = options.find(o => o.id === selection[`${category}_id`])
        return sum + (option ? option.price : 0)
    }, BASE_PRICE)

export const formatPrice = (amount) => `$${amount}`

// The photo on the Customize page is tinted to follow the chosen exterior color.
const SCENE_FILTERS = {
    'Torch Red': 'sepia(1) saturate(3) hue-rotate(-50deg) brightness(0.9)',
    'Arctic White': 'grayscale(1) brightness(2.1) contrast(0.8)',
    'Silver Flare Metallic': 'grayscale(1) brightness(1.6)',
    'Elkhart Lake Blue': 'sepia(1) saturate(4) hue-rotate(170deg) brightness(1.1)',
    'Black': 'none',
}
export const sceneFilter = (exteriorName) => SCENE_FILTERS[exteriorName] || 'none'
