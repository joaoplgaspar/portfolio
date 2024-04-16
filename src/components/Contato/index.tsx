import classNames from 'classnames'
import Section from 'components/Section'
import Subtitulo from 'components/Subtitulo'
import React, { useEffect, useState } from 'react'
import styles from './Contato.module.scss'
import Input from './Input'

export default function Contato() {
  const [nome, setNome] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [tel, setTel] = useState<number | string>()
  const [completo, setCompleto] = useState(false)

  useEffect(() => {
    if(nome !== '' && email !== '' && tel !== undefined)
      setCompleto(true)
  }, [nome, email, tel])

  return (
    <>
      <div className={styles.hr}/>
      <Section id='contato' background='#0B0B11'>
          <Subtitulo><h3><strong>Contato</strong><img src="assets/IconSections/contato.png" alt=""/></h3></Subtitulo>
          <div className={styles.container}>
              <form className={styles.inputContainer}>
                  <Input type='text' placeholder='Nome' valor={nome} setter={setNome}/>
                  <Input type='email' placeholder='Email' valor={email} setter={setEmail}/>
                  <Input type='tel' placeholder='Telefone' valor={tel} setter={setTel}/>
                  <textarea placeholder='Mensagem' required/>
                  <button 
                    disabled={!completo} 
                    className={classNames({
                      [styles.btnAtivo]: completo
                    })}
                  >
                    Enviar
                  </button>
              </form>
              <div className={styles.iframe}>
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3654.763646308976!2d-46.77338637548002!3d-23.648634023754912!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5394e84cefeb%3A0x37d78658a1a2924e!2sR.%20Pedrina%20Maria%20da%20Silva%20Valente%2C%2044%20-%20Parque%20Munhoz%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2005782-450!5e0!3m2!1spt-BR!2sbr!4v1705958696014!5m2!1spt-BR!2sbr" width="600" height="450" loading="lazy" title='google maps'></iframe>
              </div>
          </div>
      </Section>
    </>
  )
}
