import React, { useState, useEffect, useMemo } from 'react'; 
import './Montagem.css';
import Navbar from '../components/Navbar';

const ProductCard = ({ name, partType, onSelect, pecaData }) => (
  <div className="product-card" onClick={() => onSelect(partType, pecaData)}>
    <div className="product-image">
      {name}
    </div>
    <div className="product-name">{name}</div>
  </div>
);


function Montagem() {
    const partTypes = ['Processador', 'Placa Mãe', 'Placa de Vídeo', 'Memória RAM', 'Armazenamento', 'Fonte'];
    const [activePart, setActivePart] = useState('Processador');
    
    const [availableParts, setAvailableParts] = useState([]); 
    
    const [selectedParts, setSelectedParts] = useState({}); 

    
    const handlePartSelection = (partType, product) => {
        setSelectedParts(prevParts => ({
            ...prevParts,
            [partType]: product
        }));
    };

    const { totalConsumption, totalPrice } = useMemo(() => {
        const parts = Object.values(selectedParts).filter(part => part);

        const consumption = parts.reduce((sum, part) => sum + (parseFloat(part.watts_consumidos) || 0), 0);
        const price = parts.reduce((sum, part) => sum + (parseFloat(part.preco) || 0), 0);

        return {
            totalConsumption: consumption.toFixed(1),
            totalPrice: price.toFixed(2)
        };
    }, [selectedParts]);


    useEffect(() => {
        const sqlPartType = activePart 

        const fetchParts = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/pecas?tipo=${sqlPartType}`); 
                
                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status} ao buscar peças.`);
                }

                const data = await response.json(); 
                setAvailableParts(data); 
                
            } catch (error) {
                console.error(`Falha ao buscar peças para ${activePart}:`, error);
                setAvailableParts([]);
            }
        };

        fetchParts();
    }, [activePart]); 

    
    return (
        <>
            <Navbar />
            <main className="container">
                <div className="main-content">
                    <h2 className="section-title">{activePart}</h2>

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
                        {availableParts.map((peca) => (
                            <ProductCard 
                                key={peca.id_peca} 
                                name={peca.modelo} 
                                partType={activePart} 
                                pecaData={peca} 
                                onSelect={handlePartSelection} 
                            />
                        ))}
                        
                        {availableParts.length === 0 && (
                             <p>Carregando peças ou nenhuma peça encontrada para {activePart}.</p>
                        )}
                    </div>
                </div>

                <aside className="sidebar">
                    
                    <div className="selected-part-card">
                        <h3 className="part-title">
                            {selectedParts[activePart] ? selectedParts[activePart].modelo : 'Nenhuma peça selecionada'}
                        </h3>
                        <div className="part-details">
                            <p>PREÇO ESTIMADO: {selectedParts[activePart] ? `R$ ${selectedParts[activePart].preco}` : 'x'}</p>
                            <p>CONSUMO: {selectedParts[activePart] ? `${selectedParts[activePart].watts_consumidos}W` : 'x'}</p>
                        </div>
                    </div>

                    <div className="current-piece-chosen">
                        <h3 className="consumption-title">LISTAGEM SLA</h3>
                        <ul>
                            {partTypes.map(type => (
                                <p  className='text-listen' key={type}>
                                    {type}: {selectedParts[type] ? selectedParts[type].modelo : 'Não selecionado'}
                                </p>
                            ))}
                        </ul>
                        <br />
                        <p><strong>Preço Total Estimado: R$ {totalPrice}</strong></p>
                    </div>

                    
                    <div className="current-consumption-card">
                        <h3 className="consumption-title">CONSUMO ATUAL</h3>
                        <p>Consumo total: **{totalConsumption}W**</p>
                    </div>
                </aside>
            </main>
        </>
    );
}

export default Montagem;