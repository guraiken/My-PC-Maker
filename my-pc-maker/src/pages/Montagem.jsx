import React, { useState } from 'react';
import './Montagem.css'; 


const ProductCard = ({ name }) => (
  <div className="product-card">
    <div className="product-image">
      {}
    </div>
    <div className="product-name">{name}</div>
  </div>
);



function App() {
    const partTypes = ['Processador', 'Placa de Vídeo', 'Placa Mãe', 'Memória RAM', 'HD?', 'Fonte'];
    const [activePart, setActivePart] = useState('Processador');
    const productData = [
      'Algum ai', 'Algum ai', 'Algum ai', 'Algum ai',
      'Algum ai', 'Algum ai', 'Algum ai', 'Algum ai',
      'Algum ai', 'Algum ai', 'Algum ai', 'Algum ai',
    ];

    return (
        <>
            
            {/* Navbar */}
            <header className="navbar">
                <div className="logo">
                    <span>My PC Maker</span>
                </div>
                <nav className="nav-links">
                    <a href="#">Testar Build</a>
                    <a href="#">Feed</a>
                    <a href="#">Perfil</a>
                </nav>
            </header>

            {/* Layout */}
            <main className="container">
                <div className="main-content">
                    <h2 className="section-title">TIPO DA PEÇA ATUAL</h2>

                    <div className="part-type-selector">
                        {partTypes.map(type => (
                            <button 
                                key={type}
                                className={`icon-button ${activePart === type ? 'active' : ''}`}
                                onClick={() => setActivePart(type)}
                            >
                                {type}
                            </button>
                        ))}

                        <div className="search-bar">
                            <input type="text" placeholder="Buscar..." />
                        </div>
                    </div>

                    <div className="product-grid">
                        {productData.map((name, index) => (
                            <ProductCard key={index} name={name} />
                        ))}
                    </div>
                </div>

                <aside className="sidebar">
                    <div className="selected-part-card">
                        <h3 className="part-title">Algum ai</h3>
                        <div className="part-image"></div>
                        <div className="part-details">
                            <p>PREÇO ESTIMADO: x</p>
                            <p>CONSUMO: x</p>
                        </div>
                    </div>

                    <div className="current-consumption-card">
                        <h3 className="consumption-title">CONSUMO ATUAL</h3>
                        <p>XXXXXXXXXX</p>
                    </div>
                </aside>
            </main>
        </>
    );
}

export default App;