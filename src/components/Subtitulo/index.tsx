import Animacao from 'components/Animacao'
import React from 'react'
import './Subtitulo.module.scss'

export default function Subtitulo({children}: {children: any}) {
  return (
    <Animacao animation={2}>
      <div>
        {children}
      </div>
    </Animacao>
  )
}
