import Contato from 'components/Contato';
import Footer from 'components/Footer';
import Habilidades from 'components/Habilidades';
import Inicio from 'components/Inicio';
import Nav from 'components/Nav';
import Particula from 'components/Particulas';
import Projetos from 'components/Projetos';
import SobreMim from 'components/SobreMim';
import React from 'react';
import Header from './components/Header';

function App() {
  return (
    <div>
      <Particula />
      <Header />
      <Inicio />
      <Nav />
      <SobreMim />
      <Habilidades />
      <Projetos />
      <Contato />
      <Footer />
    </div>
  );
}

export default App;
