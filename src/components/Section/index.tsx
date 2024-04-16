import React from 'react'
import './Section.module.scss'

export default function Section({children, id, background}: {children: any, id: string, background?: string}) {
  return (
    <section id={id} style={{background: background}}>
        {children}
    </section>
  )
}
