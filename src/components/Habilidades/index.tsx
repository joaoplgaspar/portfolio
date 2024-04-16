import React from 'react'
import Card from './Card'
import Section from 'components/Section'
import Subtitulo from 'components/Subtitulo'
import styles from './Habilidades.module.scss'
import skills from 'services/habilidades.json'

export default function Habilidades() {
  return (
    <Section id='habilidades' background='linear-gradient(180deg, rgba(25,25,33,1) 0%, rgba(0,0,0,1) 75%)'>
        <Subtitulo>
            <h3>
                <strong>Habilidades</strong>
                <img src="assets/IconSections/habilidades.png" alt=''/>
            </h3>
        </Subtitulo>
        <div className={styles.container}>
          {skills.habilidades.map(skill => (
            <Card 
              habilidade={skill.habilidade}
              icon={skill.icon}
              nivel={skill.nivel}
              key={skill.habilidade}
            />
          ))}
        </div>
    </Section>
  )
}
