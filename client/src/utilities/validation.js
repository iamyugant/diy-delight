import { CATEGORIES } from './calcprice'

// Returns the rules (with reasons) that the current selection breaks.
export const findConflicts = (selection, incompatibilities) => {
    const chosen = new Set(CATEGORIES.map(c => selection[`${c}_id`]))
    return incompatibilities.filter(r => chosen.has(r.option_a) && chosen.has(r.option_b))
}

// Would picking `optionId` clash with something already selected in another category?
export const conflictFor = (optionId, selection, incompatibilities, category) => {
    const others = new Set(
        CATEGORIES.filter(c => c !== category).map(c => selection[`${c}_id`])
    )
    return incompatibilities.find(r =>
        (r.option_a === optionId && others.has(r.option_b)) ||
        (r.option_b === optionId && others.has(r.option_a))
    )
}
