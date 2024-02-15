import React from 'react'
import styles from './Input.module.scss'

interface InputProps {
    type: string
    placeholder: string
}

export default function Input({type, placeholder}:InputProps) {
  return (
    <div className={styles.container}>
        <input type={type} placeholder={placeholder}/>
    </div>
  )
}
