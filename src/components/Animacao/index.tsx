import {motion, useInView, useAnimation } from 'framer-motion'
import React, { useEffect, useRef } from 'react'

interface AnimacaoProps {
  children: JSX.Element | JSX.Element[], 
  animation: number
}

export default function Animacao({children, animation=1}: AnimacaoProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {once: true});

  const variantes = {
    1: {
      hidden: {opacity: 0, y: 75},
      visible: {opacity: 1, y: 0},
    },
    2: {
      hidden: {opacity: 0, x: -100},
      visible: {opacity: 1, x: 0},
    }
  }

  const controle = useAnimation()

  useEffect(() => {
    if(isInView) {
      controle.start("visible")
    }
    // eslint-disable-next-line
  }, [isInView])

  return (
    <div ref={ref}>
      <motion.div
        variants={animation === 1 ? variantes[1] : variantes[2]}
        initial="hidden"
        animate={controle}
        transition={{duration: 0.5, delay: 0.25}}
      >
        {children}
      </motion.div>
    </div>
  )
}
