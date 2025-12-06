import React, { useState, useEffect, useMemo, useContext } from 'react';
import './Montagem.css';
import Navbar from '../components/Navbar';
import { span } from 'framer-motion/client';
import { GlobalContext } from '../contexts/globalContext';

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
    const { usuarioLogado } = useContext(GlobalContext);

    const [availableParts, setAvailableParts] = useState([]);

    // 1. Inicializa Memória RAM com uma estrutura de objeto que inclui 'quantidade'
    const [selectedParts, setSelectedParts] = useState({
        'Memória RAM': { peca: null, quantidade: 1 } // Inicializa RAM com quantidade 1
    });


    // 2. Ajusta handlePartSelection para lidar com RAM vs. outras peças
    const handlePartSelection = (partType, product) => {
        setSelectedParts(prevParts => {
            if (partType === 'Memória RAM') {
                // Para RAM, atualiza a subpropriedade 'peca' e mantém a 'quantidade'
                return {
                    ...prevParts,
                    [partType]: {
                        peca: product,
                        quantidade: prevParts[partType]?.quantidade || 1
                    }
                };
            } else {
                // Para outras peças, armazena o produto diretamente
                return {
                    ...prevParts,
                    [partType]: product
                };
            }
        });
    };

    // 3. Função para aumentar/diminuir a quantidade de RAM
    const handleRamQuantityChange = (delta) => {
        setSelectedParts(prevParts => {
            const currentRam = prevParts['Memória RAM'];
            if (!currentRam || !currentRam.peca) return prevParts; // Peça não selecionada

            const newQuantity = Math.max(1, currentRam.quantidade + delta); // Mínimo 1

            return {
                ...prevParts,
                'Memória RAM': {
                    ...currentRam,
                    quantidade: newQuantity
                }
            };
        });
    };

    // 4. Ajusta useMemo para incluir a quantidade no cálculo de RAM
    const { totalConsumption, totalPrice } = useMemo(() => {
        const partsArray = Object.entries(selectedParts);

        // Função para calcular o consumo total
        const totalConsumption = partsArray.reduce((sum, [partType, part]) => {
            if (!part) return sum;

            // Verifica se é RAM e obtém a peça e a quantidade
            let item = partType === 'Memória RAM' ? part.peca : part;
            let quantity = partType === 'Memória RAM' ? (part.quantidade || 1) : 1;

            if (!item) return sum; // Se a RAM foi inicializada, mas a peça não foi selecionada

            return sum + ((parseFloat(item.watts_consumidos) || 0) * quantity);
        }, 0);

        // Função para calcular o preço total
        const totalPrice = partsArray.reduce((sum, [partType, part]) => {
            if (!part) return sum;

            // Verifica se é RAM e obtém a peça e a quantidade
            let item = partType === 'Memória RAM' ? part.peca : part;
            let quantity = partType === 'Memória RAM' ? (part.quantidade || 1) : 1;

            if (!item) return sum; // Se a RAM foi inicializada, mas a peça não foi selecionada

            return sum + ((parseFloat(item.preco) || 0) * quantity);
        }, 0);

        return {
            totalConsumption: totalConsumption.toFixed(1),
            totalPrice: totalPrice.toFixed(2)
        };
    }, [selectedParts]);


    useEffect(() => {
        const sqlPartType = activePart

        const fetchParts = async () => {
            try {
                const response = await fetch(`https://my-pc-maker-cq8f.vercel.app/api/pecas?tipo=${sqlPartType}`);

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


 

  const handleSaveConfig = async () => {
    
   
    if (!usuarioLogado || typeof usuarioLogado !== 'object' || !usuarioLogado.id_usuario) {
        alert("Você precisa estar logado para salvar uma montagem!");
        return; 
    }

    // 2. PREPARAÇÃO DO ARRAY DE PEÇAS (TRATA MÚLTIPLAS RAMS E FILTRA CATEGORIAS)
    
    // Converte o objeto selectedParts em um array de entradas [tipo, valor]
    const entries = Object.entries(selectedParts);

    // Filtra apenas as categorias que realmente possuem uma peça selecionada
    const pecasSelecionadasValidas = entries.filter(([type, entry]) => {
        // Se for RAM, a peça está em entry.peca
        if (type === 'Memória RAM') {
            return entry?.peca !== null;
        }
        // Para todas as outras, a peça é o próprio entry (não nulo)
        return entry !== null && entry.modelo;
    });


    // 2. VALIDAÇÃO CORRETA: Verifica se 6 CATEGORIAS têm peças.
    const categoriesSelected = pecasSelecionadasValidas.length;

    if (categoriesSelected < 6) { 
        alert("Selecione todas as 6 categorias de peças para salvar.");
        console.log('Peças selecionadas (para validação):', pecasSelecionadasValidas);
        return;
    }

    // 3. Prepara a array final (pecasToSave) para o Backend (incluindo RAM multiplicada)
    const pecasToSave = pecasSelecionadasValidas.flatMap(([type, entry]) => {
        
        if (type === 'Memória RAM') {
            // Retorna a peça (entry.peca) multiplicada pela quantidade
            return Array(entry.quantidade).fill(entry.peca);
        }
        
        // Outras peças são enviadas 1x
        return [entry]; 
    });

    // AQUI O CÓDIGO CONTINUA COM O PAYLOAD E O FETCH
    const payload = {
        potencia_necessaria: totalConsumption,
        preco_estimado: totalPrice,
        usuario_id: usuarioLogado.id_usuario,
        pecas: pecasToSave // Este array contém objetos completos das peças, o que é aceito no backend
    };
    
    // Linha de log corrigida para mostrar as peças que VÃO ser salvas
    console.log('Peças a serem salvas (incluindo múltiplas RAMs):', pecasToSave);


    try {
        const response = await fetch(`https://my-pc-maker-cq8f.vercel.app/api/computador`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro desconhecido do servidor.');
        }

        alert("Configuração salva com sucesso!");

    } catch (error) {
        console.error("Falha ao salvar a configuração:", error);
        alert(`Falha ao salvar a configuração: ${error.message}`);
    }
};
    return (
        <>
            <Navbar />
            <main className="container">
                <div className="main-content">
                    <h2 className="section-title">Montagem de PC</h2>

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
                        {availableParts.map((peca) => {
                            return (
                                <ProductCard
                                    key={peca.id_peca}
                                    name={peca.modelo}
                                    partType={activePart}
                                    pecaData={peca}
                                    onSelect={handlePartSelection}
                                />
                            )
                        })}

                    </div>
                    {availableParts.length === 0 && (
                        <p>Carregando peças ou nenhuma peça encontrada para {activePart}.</p>
                    )}
                </div>

                <aside className="sidebar">

                    <div className="selected-part-card">
                        <h3 className="part-title">
                            {activePart === 'Memória RAM'
                                ? (selectedParts[activePart]?.peca ? selectedParts[activePart].peca.modelo : 'Nenhuma peça selecionada')
                                : (selectedParts[activePart] ? selectedParts[activePart].modelo : 'Nenhuma peça selecionada')
                            }
                        </h3>
                        <div className="part-details">
                            {(activePart === 'Memória RAM' ? selectedParts[activePart]?.peca : selectedParts[activePart]) ?
                                <div>
                                    <p>PREÇO ESTIMADO: R$ {(activePart === 'Memória RAM' ? selectedParts[activePart].peca.preco : selectedParts[activePart].preco)}</p>
                                    <p>CONSUMO: {(activePart === 'Memória RAM' ? selectedParts[activePart].peca.watts_consumidos : selectedParts[activePart].watts_consumidos)}W</p>
                                </div>
                                :
                                <></>
                            }
                        </div>
                    </div>

                    <div className="current-piece-chosen">
                        <h3 className="consumption-title">PEÇAS SELECIONADAS</h3>
                        <ul>
                            {partTypes.map(type => {
                                const partEntry = selectedParts[type];

                                let partName = 'Não selecionado';
                                let quantity = 1;
                                let isRam = type === 'Memória RAM';

                                // Determina o nome e a quantidade da peça (se for RAM)
                                if (isRam && partEntry?.peca) {
                                    partName = partEntry.peca.modelo;
                                    quantity = partEntry.quantidade;
                                } else if (!isRam && partEntry) {
                                    partName = partEntry.modelo;
                                }

                                return (
                                    <p className='text-listen' key={type}>
                                        <strong>{type}:</strong> {partName}

                                        {/* Botões de Aumentar/Diminuir para RAM */}
                                        {isRam && partEntry?.peca && (
                                            <span className=''>
                                                ({quantity}x)
                                                <button onClick={() => handleRamQuantityChange(-1)} disabled={quantity <= 1} style={{ marginRight: '5px' }}>-</button>
                                                <button onClick={() => handleRamQuantityChange(1)} disabled={quantity >= 8}>+</button>
                                            </span>
                                        )}
                                    </p>
                                );
                            })}
                        </ul>
                        <br />
                        <p><strong>Preço Total Estimado: R$ {totalPrice}</strong></p>
                    </div>


                    <div className="current-consumption-card">
                        <h3 className="consumption-title">CONSUMO ATUAL</h3>
                        <p>{totalConsumption}W</p>
                    </div>

                    <div className="save-button">
                     <button className="button-save" onClick={handleSaveConfig}>Salvar</button>
                    </div>
                </aside>
            </main>
        </>
    );
}

export default Montagem;