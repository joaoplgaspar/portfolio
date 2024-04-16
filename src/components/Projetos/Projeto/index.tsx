import Paragrafo from 'components/Paragrafo'
import Subtitulo from 'components/Subtitulo'
import React from 'react'
import { Carousel } from 'react-responsive-carousel'
import styles from './Projeto.module.scss'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import projetos from 'services/projetos.json'
import Animacao from 'components/Animacao'
import classNames from 'classnames'

export default function Projeto({nome, descricao, images, tecnologias, github, site}: typeof projetos.projetos[0]) {
  return (    
    <div className={styles.container}>
        <div className={styles.image__container}>
          <Animacao animation={1}>
            <Carousel showArrows infiniteLoop showThumbs={false} showStatus={false} autoPlay={true} interval={5000}>
              {images.map(image => (
                <img src={`assets/Projetos/${image}`} alt="" />
              ))}
            </Carousel>
          </Animacao>
          <div className={classNames({
            [styles.btns]: true,
            [styles.btnsImage]: true
          })}>
            <a href={github} className={styles.github} target="_blank" rel="noopener noreferrer">Github <img src="assets/IconSocial/github.png" alt="" /></a>
            <a href={site} className={styles.site} target="_blank" rel="noopener noreferrer">Site <img src="assets/IconSocial/site.png" alt="" /></a>
          </div>
        </div>
        <div className={styles.content__container}>
          <Subtitulo><h4><strong>{nome}</strong></h4></Subtitulo>
          <Paragrafo>{descricao}</Paragrafo>
          <ul> Tecnologias usadas
            {tecnologias.map(tec => (
              <li className={classNames({
                [styles.html]: tec === 'HTML5',
                [styles.css]: tec === 'CSS3',
                [styles.react]: tec === 'React',
                [styles.sass]: tec === 'Sass',
                [styles.js]: tec === 'JavaScript',
                [styles.ts]: tec === 'TypeScript',
              })}>{tec}</li>
            ))}
            {/* <li className={styles.html}>HTML5</li>
            <li className={styles.css}>CSS3</li>
            <li className={styles.react}>React</li>
            <li className={styles.sass}>Sass</li>
            <li className={styles.js}>JavaScript</li>
            <li className={styles.ts}>Typescript</li> */}
          </ul>
          <div className={styles.btns}>
            <a href={github} className={styles.github} target="_blank" rel="noopener noreferrer">Github <img src="assets/IconSocial/github.png" alt="" /></a>
            <a href={site} className={styles.site} target="_blank" rel="noopener noreferrer">Site <img src="assets/IconSocial/site.png" alt="" /></a>
          </div>
        </div>
    </div>
  )
}
