import classNames from 'classnames'
import React, { useState } from 'react'
import styles from './Input.module.scss'

interface InputProps {
    type: string
    placeholder: string
    valor: string | number | undefined
    setter: React.Dispatch<React.SetStateAction<string>> | React.Dispatch<React.SetStateAction<string | number | undefined>>
}

export default function Input({type, placeholder, valor, setter}:InputProps) {
  const [focado, setFocado] = useState(false)

  function conferirTexto(){
    if(valor === '' || valor === undefined) {
      setFocado(false)
    }
  }

  return (
    <div className={styles.container}>
        <input 
          required
          type={type} 
          onFocus={() => setFocado(true)}
          onBlur={() => conferirTexto()}
          value={valor}
          onChange={(event) => setter(event.target.value)}
        />
        <label className={classNames({
          [styles.focado]: focado
        })}>
          {placeholder}
        </label>
    </div>
  )
}
