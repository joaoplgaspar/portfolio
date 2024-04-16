import Section from 'components/Section'
import React from 'react'
import Subtitulo from 'components/Subtitulo'
import Projeto from './Projeto'
import projetos from 'services/projetos.json'
import './Projetos.module.scss'

export default function Projetos() {
  return (
    <Section id='projetos' background='#0d0d0d83'>
        <Subtitulo>
            <h3>
                <strong>Projetos</strong>
                <img src="assets/IconSections/projetos.png" alt=''/>
            </h3>
        </Subtitulo>
        {projetos.projetos.map(projeto => (
          <Projeto {...projeto}/>
        ))}
    </Section>
  )
}
