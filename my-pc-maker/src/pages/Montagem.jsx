import React, { useState, useEffect, useMemo, useContext } from 'react';
import './Montagem.css';
import Navbar from '../components/Navbar';
import { span } from 'framer-motion/client';
import { GlobalContext } from '../contexts/globalContext';
import ErrorAlert from '../components/Alerts/ErrorAlert';
import ConfirmationAlert from '../components/Alerts/ConfirmationAlert';

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

    const [selectedParts, setSelectedParts] = useState({
        'Memória RAM': { peca: null, quantidade: 1 }
    });


    const handlePartSelection = (partType, product) => {
        setSelectedParts(prevParts => {
            if (partType === 'Memória RAM') {
                return {
                    ...prevParts,
                    [partType]: {
                        peca: product,
                        quantidade: prevParts[partType]?.quantidade || 1
                    }
                };
            } else {
                return {
                    ...prevParts,
                    [partType]: product
                };
            }
        });
    };

    const handleRamQuantityChange = (delta) => {
        setSelectedParts(prevParts => {
            const currentRam = prevParts['Memória RAM'];
            if (!currentRam || !currentRam.peca) return prevParts;

            const newQuantity = Math.max(1, currentRam.quantidade + delta);

            return {
                ...prevParts,
                'Memória RAM': {
                    ...currentRam,
                    quantidade: newQuantity
                }
            };
        });
    };

    const { totalConsumption, totalPrice, psuCapacity } = useMemo(() => {
        const partsArray = Object.entries(selectedParts);

        let consumptionWithoutPSU = 0;
        let psuWattage = 0;
        let totalPrice = 0;

        partsArray.forEach(([partType, part]) => {
            if (!part) return;

            let item = partType === 'Memória RAM' ? part.peca : part;
            let quantity = partType === 'Memória RAM' ? (part.quantidade || 1) : 1;

            if (!item) return;

            totalPrice += ((parseFloat(item.preco) || 0) * quantity);

            if (partType === 'Fonte') {
                psuWattage = parseFloat(item.watts_consumidos) || 0;
            } else {
                consumptionWithoutPSU += ((parseFloat(item.watts_consumidos) || 0) * quantity);
            }
        });

        return {
            totalConsumption: consumptionWithoutPSU.toFixed(1),
            totalPrice: totalPrice.toFixed(2),
            psuCapacity: psuWattage
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
        if (!selectedParts['Processador'] || !selectedParts['Placa Mãe']) {
            ErrorAlert({titulo:"Erro", texto:"Você deve selecionar um Processador e uma Placa Mãe antes de salvar.", tempo: 1500});
            return;
        }

        const psu = selectedParts['Fonte'];

        if (!psu) {
            ErrorAlert({titulo:"Erro", texto:"Você deve selecionar uma Fonte antes de salvar.", tempo: 1500});
            return;
        }

        const consumoNecessario = parseFloat(totalConsumption);
        const capacidadeDaFonte = parseFloat(psuCapacity);

        if (capacidadeDaFonte < consumoNecessario) {
            ErrorAlert({titulo:"Erro", texto:"Selecione uma fonte mais potente antes de salvar!", tempo: 1500});
            return;
        }


        const dataToSave = {
            usuario_id: usuarioLogado.id_usuario,
            potencia_necessaria: consumoNecessario,
            preco_estimado: parseFloat(totalPrice),
            pecas: []
        };



        Object.entries(selectedParts).forEach(([tipo, peca]) => {
            if (tipo === 'Memória RAM' && peca.peca) {
                for (let i = 0; i < peca.quantidade; i++) {
                    dataToSave.pecas.push({
                        id_peca: peca.peca.id_peca,
                        tipo: tipo
                    });
                }
            } else if (peca && tipo !== 'Memória RAM') {
                dataToSave.pecas.push({
                    id_peca: peca.id_peca,
                    tipo: tipo
                });
            }
        });

        try {
            const response = await fetch('https://my-pc-maker-cq8f.vercel.app/api/computador', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSave),
            });

            if (response.ok) {
                ConfirmationAlert({titulo:"Sucesso", texto:"Configuração salva com sucesso!", tempo: 1500});
            } else {
                const errorData = await response.json();
                ErrorAlert({titulo: "Erro", texto: `Erro ao salvar configuração` + (errorData.error ? `: ${errorData.error}` : '.'), tempo: 2000});
            }
        } catch (error) {
            console.error('Erro de rede ao salvar:', error);
            ErrorAlert({titulo: "Erro", texto: "Erro de conexão ao salvar a configuração.", tempo: 2000});
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

                                if (isRam && partEntry?.peca) {
                                    partName = partEntry.peca.modelo;
                                    quantity = partEntry.quantidade;
                                } else if (!isRam && partEntry) {
                                    partName = partEntry.modelo;
                                }

                                return (
                                    <p className='text-listen' key={type}>
                                        <strong>{type}:</strong> {partName}

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
                        <h3 className="consumption-title">CONSUMO</h3>
                        <div className="consumption-header">
                            <h4>PEÇAS</h4>
                            <h4>/</h4>
                            <h4>CAPACIDADE</h4>
                        </div>
                        <p>
                            {totalConsumption}W
                            {selectedParts['Fonte'] && psuCapacity > 0 ? (
                                (() => {
                                    const consumo = parseFloat(totalConsumption);

                                    const capacidade = parseFloat(psuCapacity).toFixed(1);

                                    const folga = (parseFloat(psuCapacity) - consumo);

                                    const corFolga = folga < 0 ? 'red' : 'green';

                                    let textoStatus = '';
                                    let valorExibido = Math.abs(folga).toFixed(1);

                                    if (folga < 0) {
                                        textoStatus = 'falta';
                                    } else {
                                        textoStatus = 'sobrando';
                                    }

                                    return (
                                        <>
                                            {` / ${capacidade}W `}
                                            <span style={{ color: corFolga, fontWeight: 'bold' }}>
                                                {`(${valorExibido}W ${textoStatus})`}
                                            </span>
                                        </>
                                    );
                                })()
                            ) : ''}
                        </p>
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