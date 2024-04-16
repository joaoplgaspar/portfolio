import styles from './Inicio.module.scss';
import ReactTypingEffect from 'react-typing-effect';
import IconLink from 'components/IconLink';
import socialMedia from 'services/social.json'
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import Animacao from 'components/Animacao';

export default function Inicio() {
    return (
        <ParallaxProvider>
            <div className={styles.inicio} id='inicio'>
                <div className={styles.container}>
                    <Animacao animation={1}>
                        <Parallax speed={10}>
                            <div className={styles.container__text}>
                                <h2>Olá Mundo!</h2>
                                <h3>Eu sou o <strong>João</strong>, um <strong>
                                    <ReactTypingEffect
                                        text={["Front-end Developer!", "Web Designer!", "Designer!"]}
                                        speed={100}
                                        typingDelay={200}
                                    />
                                </strong></h3>
                                <div className={styles.container__text__links}>
                                    {socialMedia.social.map(media => (
                                        <IconLink 
                                            color={media.cor}
                                            img={media.imagem}
                                            link={media.link}
                                            name={media.nome}
                                            key={media.nome}
                                        />
                                    ))}
                                </div>
                            </div>
                        </Parallax>
                    </Animacao>
                    <Animacao animation={2}>
                        <Parallax speed={40}>
                            <div className={styles.container__figure}>
                                <div className={styles.container__figure__bolaSegue}/>
                                <div className={styles.container__figure__bolaFundo}/>
                            </div>     
                        </Parallax>
                    </Animacao>
                    
                </div>
                <Parallax speed={50}>
                    <div className={styles.border} style={{background: "#0B0B11", height: "1000px"}}/>
                </Parallax>
                <Parallax speed={40}>
                    <div className={styles.border} style={{background: "#9A1832", height: "600px"}}/>
                </Parallax>
                <Parallax speed={10}>
                    <div className={styles.border} style={{background: "#F6325A", height: "400px"}}/>
                </Parallax>
            </div>
        </ParallaxProvider>
    )
}
