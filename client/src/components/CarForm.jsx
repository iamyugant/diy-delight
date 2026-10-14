import React, { useEffect, useState } from 'react'
import OptionPicker from './OptionPicker'
import { getOptions, getIncompatibilities } from '../services/OptionsAPI'
import { CATEGORIES, calcTotal, formatPrice, sceneFilter } from '../utilities/calcprice'
import { findConflicts } from '../utilities/validation'

// Shared by the create and edit pages. `initial` is an existing car (edit) or undefined (create).
const CarForm = ({ initial, submitLabel, onSubmit }) => {
    const [options, setOptions] = useState([])
    const [incompatibilities, setIncompatibilities] = useState([])
    const [selection, setSelection] = useState({})
    const [name, setName] = useState(initial?.name || '')
    const [openCategory, setOpenCategory] = useState(null)
    const [error, setError] = useState('')
    const [saving, setSaving] = useState(false)
    const [loadError, setLoadError] = useState('')

    useEffect(() => {
        const load = async () => {
            try {
                const [opts, rules] = await Promise.all([getOptions(), getIncompatibilities()])
                setOptions(opts)
                setIncompatibilities(rules)
                const defaults = {}
                CATEGORIES.forEach(category => {
                    const key = `${category}_id`
                    defaults[key] = initial?.[key] ?? opts.find(o => o.category === category)?.id
                })
                setSelection(defaults)
            } catch (err) {
                setLoadError(err.message)
            }
        }
        load()
    }, [initial])

    const chosen = (category) => options.find(o => o.id === selection[`${category}_id`])
    const conflicts = findConflicts(selection, incompatibilities)

    const handleSelect = (category, id) => {
        setError('')
        setSelection(prev => ({ ...prev, [`${category}_id`]: id }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (saving) return
        setError('')
        setSaving(true)
        try {
            await onSubmit({ name, ...selection })
        } catch (err) {
            setError(err.message)
            setSaving(false)
        }
    }

    if (loadError) return <p role='alert' className='form-error'>{loadError}</p>
    if (options.length === 0) return <p aria-busy='true'>Loading options…</p>

    return (
        <form className='car-form' onSubmit={handleSubmit}>
            <div className='create-car'>
                <label className='convertible-toggle'>
                    <input type='checkbox' id='isconvertible' checked={chosen('roof')?.name === 'Convertible'}
                        onChange={e => {
                            const roofs = options.filter(o => o.category === 'roof')
                            const target = roofs.find(o => o.name === (e.target.checked ? 'Convertible' : 'Body Color'))
                            if (target) handleSelect('roof', target.id)
                        }} />
                    Convertible
                </label>

                <div className='create-car-options'>
                    <div className='car-options'>
                        {CATEGORIES.map(category => (
                            <button key={category} type='button' title={`Current: ${chosen(category)?.name}`}
                                aria-label={`${category} (current: ${chosen(category)?.name})`}
                                onClick={() => setOpenCategory(category)}>
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className='create-car-name'>
                    <input type='text' id='name' name='name' placeholder='My New Car' value={name} maxLength={80}
                        aria-label='Car name' onChange={e => { setName(e.target.value); setError('') }} />
                    <input type='submit' className='create-car-button' value={saving ? 'Saving…' : submitLabel} disabled={saving} />
                </div>
            </div>

            {conflicts.length > 0 && (
                <p role='alert' className='form-error'>⚠ Impossible combination: {conflicts[0].reason}</p>
            )}
            {error && <p role='alert' className='form-error'>{error}</p>}

            <div className='scene' style={{ filter: sceneFilter(chosen('exterior')?.name) }} />

            <div className='create-car-price'>💰{formatPrice(calcTotal(selection, options))}</div>

            <OptionPicker category={openCategory} selection={selection}
                options={options.filter(o => o.category === openCategory)}
                incompatibilities={incompatibilities}
                onSelect={handleSelect} onClose={() => setOpenCategory(null)} />
        </form>
    )
}

export default CarForm
