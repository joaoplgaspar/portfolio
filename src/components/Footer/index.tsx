import React from 'react'
import styles from './Footer.module.scss'

export default function Footer() {
  return (
    <footer>
      <div className={styles.contato}>
        <h4>Contato</h4>
        <ul>
          <li><img src="assets/IconSocial/tel.png" alt="Icone telefone" />(11) 97954-2324</li>
          <li><img src="assets/IconSocial/email.png" alt="Icone email" /> jpgasparsr7@gmail.com</li>
          <li><img src="assets/IconSocial/loc.png" alt="Icone localização" /> São Paulo, São Paulo - Brasil</li>
        </ul>
      </div>
      <p className={styles.copyright}>© Desenvolvido por João Pedro Lima Gaspar</p>
    </footer>
  )
}
