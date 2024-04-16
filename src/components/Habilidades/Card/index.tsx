import Animacao from 'components/Animacao'
import React from 'react'
import styles from "./Card.module.scss"

interface CardProps {
    icon: string,
    habilidade: string,
    nivel: string
}

export default function Card({icon, habilidade, nivel}:CardProps) {
  return (
    <Animacao animation={1}>
      <div className={styles.card}>
          <img src={`assets/IconSkills/${icon}`} alt="" />
          <div>
              <p className={styles.skill}>{habilidade}</p>
              <p className={styles.nivel}>{nivel}</p>
          </div>
      </div>
    </Animacao>
  )
}
