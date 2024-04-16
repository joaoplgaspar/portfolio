import React from 'react'
import styles from './Item.module.scss'

interface IconProps {
    img: string
    link: string
    name: string
}

export default function Item({img, link, name}: IconProps) {
  return (
    <a href={link} className={styles.item}>
      <p>{name}</p>
      <img src={`assets/${img}`} alt={name} />
    </a>
  )
}
