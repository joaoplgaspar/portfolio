import React, { useState } from 'react'
import styles from './Nav.module.scss'
import sections from 'services/sections.json'
import classNames from 'classnames'
import Item from './Item'

export default function Nav() {
    const [scrollado, setScrollado] = useState(false)

    window.addEventListener('scroll', () => {
        if(window.scrollY > 0) {
        return setScrollado(true)
        } 
        return setScrollado(false)
    });

    return (
        <div className={classNames({
            [styles.nav]: true,
            [styles.scrollado]: scrollado
        })}>
            {sections.sections.map(sec => (
                <Item
                    img={sec.imagem}
                    link={sec.link}
                    name={sec.nome}
                    key={sec.nome}
                />
            ))}
        </div>
    )
}
