import Animacao from 'components/Animacao'
import React from 'react'
import styles from './Paragrafo.module.scss'

export default function Paragrafo({children}: {children: string}) {
  return (
    <Animacao animation={2}>
      <p className={styles.paragrafo}>
          {children}
      </p>
    </Animacao>
  )
}
