import Animacao from 'components/Animacao'
import styles from './IconLink.module.scss'

interface IconProps {
  img: string
  link: string
  name: string
  color?: string
}

export default function IconLink({img, link, name, color}: IconProps) {
  return (
    <Animacao animation={2}>
      <a href={link} style={{background: color}} className={styles.social}>
        <img src={`assets/${img}`} alt={name} />
      </a>
    </Animacao>
  )
}
