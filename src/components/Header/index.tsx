import classNames from 'classnames';
import styles from './Header.module.scss'

export default function Header() {
  return (
    <header className={classNames({
      [styles.header]: true
    })}>
        <h1>JPG</h1>
        <nav>
            <a href="#inicio">Inicio</a>
            <a href="#sobre">Sobre Mim</a>
            <a href="#habilidades">Habilidades</a>
            <a href="#projetos">Projetos</a>
            <a href="#contato">Contato</a>
        </nav>
    </header>
  )
}
