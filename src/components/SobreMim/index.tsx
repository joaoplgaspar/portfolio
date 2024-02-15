import Subtitulo from 'components/Subtitulo'
import React from 'react'
import styles from './SobreMim.module.scss'
import Paragrafo from 'components/Paragrafo'
import background from './sobremimBackground.png';
import foto from './minhaFoto.png';
import Section from 'components/Section'
import Animacao from 'components/Animacao';

export default function SobreMim() {
  return (
    <Section id='sobre' background='#191921'>
      <Subtitulo>
        <h3>  
          <strong>Sobre</strong> mim
          <img src="assets/IconSections/sobremim.png" alt="" />
        </h3>
      </Subtitulo>

      <div className={styles.container}>
        <div className={styles.container__image}>
          <Animacao animation={1}>
            <img className={styles.foto} src={foto} alt="" />
            <img className={styles.background} src={background} alt=""/>
          </Animacao>
        </div>
        <div className={styles.container__texts}>
          <Subtitulo>
            <h4>João Pedro Lima Gaspar</h4>
          </Subtitulo>
          <Subtitulo>
            <h5><strong>Front-end & Design</strong></h5>
          </Subtitulo>
          <Paragrafo>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </Paragrafo>
          <Subtitulo>
            <h5><strong>Educação</strong></h5>
          </Subtitulo>
          <Paragrafo>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </Paragrafo>
        </div>
      </div>
    </Section>
  )
}
