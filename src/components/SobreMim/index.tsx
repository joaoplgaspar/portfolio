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
            Sou um estudante do 3º semestre na graduação em Ciência da Computação e anteriormente cursei o ensino médio integrado com o curso de TI, onde desenvolvi habilidades sólidas em programação e na lógica de programação, banco de dados, robótica e principalmente na área do front-end. Possuo uma grande experiência em desenvolvimento de sites, utilizando ferramentas e tecnologias como HTML, CSS, JavaScript e um pouco de React. Estou sempre aberto a aprender novas habilidades e tecnologias para aprimorar meu conjunto de habilidades e aplicá-las em projetos desafiadores.
          </Paragrafo>
          <Subtitulo>
            <h5><strong>Educação</strong></h5>
          </Subtitulo>
          <Paragrafo>
            CURSANDO 3º SEMESTRE <strong>CIÊNCIA DA COMPUTAÇÃO</strong> - CAMPUS UNASP-SP 2026
          </Paragrafo>
          <Paragrafo>
            ENSINO MÉDIO TÉCNICO EM <strong>TECNOLOGIA DA INFORMAÇÃO</strong> - CAMPUS UNASP-SP 2020 - 2022
          </Paragrafo>
        </div>
      </div>
    </Section>
  )
}
