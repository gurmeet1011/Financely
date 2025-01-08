import React from 'react'
import './styles.css'

function Input({ state, setState, placeholder, label,type }) {
    return (
        <div className='input-wrapper'>
            <label className='label-input'>{label}</label>
            <input type={type} className='custom-input' placeholder={placeholder} value={state} onChange={(e) => setState(e.target.value)} />
        </div>
    )
}

export default Input