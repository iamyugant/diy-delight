import React from 'react'
import Modal from 'react-modal'
import { formatPrice } from '../utilities/calcprice'
import { conflictFor } from '../utilities/validation'

Modal.setAppElement('#root')

const OptionPicker = ({ category, options, selection, incompatibilities, onSelect, onClose }) => {
    const selectedId = selection[`${category}_id`]

    return (
        <Modal isOpen={!!category} onRequestClose={onClose} className='picker' overlayClassName='picker-overlay'
            contentLabel={`Choose ${category}`}>
            <h2 style={{ textTransform: 'capitalize' }}>Choose {category}</h2>
            <div className='picker-grid'>
                {options.map(option => {
                    const conflict = conflictFor(option.id, selection, incompatibilities, category)
                    return (
                        <button key={option.id} type='button'
                            className={`option-card ${option.id === selectedId ? 'selected' : ''}`}
                            onClick={() => { onSelect(category, option.id); onClose() }}>
                            <span className='swatch' style={{ background: option.color }} />
                            <strong>{option.name}</strong>
                            <span>{option.price === 0 ? 'Included' : `+${formatPrice(option.price)}`}</span>
                            {conflict && <small className='conflict'>⚠ {conflict.reason}</small>}
                        </button>
                    )
                })}
            </div>
            <button type='button' onClick={onClose}>Close</button>
        </Modal>
    )
}

export default OptionPicker
