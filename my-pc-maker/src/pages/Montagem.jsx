import React, { useState, useEffect, useMemo, useContext } from 'react';
import './Montagem.css';
import Navbar from '../components/Navbar';
import { GlobalContext } from '../contexts/globalContext';
import ErrorAlert from '../components/Alerts/ErrorAlert';
import ConfirmationAlert from '../components/Alerts/ConfirmationAlert';
import { IoIosRemoveCircle } from 'react-icons/io';

// --- COMPONENTE DO MEDIDOR (GAUGE) (mantido) ---
const ConsumptionGauge = ({ value, max }) => {
    // ... (Seu código ConsumptionGauge aqui)
    const maxValue = max > 0 ? max : 1000;
    const percentage = Math.min(Math.max(value / maxValue, 0), 1);
    
    // Rotação: -90 (vazio) a 90 (cheio)
    const rotation = -90 + (percentage * 180);

    // --- CONFIGURAÇÃO DE CORES DA SUA PALETA ---
    const colors = {
        background: "var(--fundo)",  
        safe: "#00e676",      
        warning: "var(--destaque)", 
        danger: "var(--erro)",   
        needle: "var(--destaque)" // Usando o destaque para a agulha
    };

    // Lógica para decidir a cor atual baseada na porcentagem
    let currentColor = colors.safe;
    if (value > maxValue) currentColor = colors.danger;
    else if (percentage > 0.85) currentColor = colors.warning;

    return (
        <div className="gauge-container">
            <svg viewBox="0 0 200 110" className="gauge-svg">
                {/* 1. Arco de Fundo */}
                <path 
                    d="M 20 100 A 80 80 0 0 1 180 100" 
                    fill="none" 
                    stroke={colors.background} 
                    strokeWidth="20" 
                    strokeLinecap="round"
                />
                
                {/* 2. Arco de Progresso (Colorido) */}
                <path 
                    d="M 20 100 A 80 80 0 0 1 180 100" 
                    fill="none" 
                    stroke={currentColor} 
                    strokeWidth="20" 
                    strokeLinecap="round"
                    strokeDasharray={`${percentage * 251.2} 251.2`} 
                    className="gauge-progress"
                />

                {/* 3. AGULHA (Ponteiro) */}
                <g transform={`translate(100, 100) rotate(${rotation})`}>
                    {/* Haste da agulha */}
                    <path d="M -4 0 L 0 -75 L 4 0 Z" fill={colors.needle} />
                    {/* Círculo central (pivô) */}
                    <circle cx="0" cy="0" r="6" fill={colors.needle} />
                </g>

            </svg>
        </div>
    );
};
// --- COMPONENTE PRODUCT CARD (mantido) ---
const ProductCard = ({ name, partType, onSelect, pecaData, image, namePlaceholder }) => (
    <div className="product-card" onClick={() => onSelect(partType, pecaData)}>
        <div className="product-image" style={{overflow: 'hidden'}}>
            {image != null && <img src={image} alt="" style={{width: "168px", height: "168px"}}/>} 
            {namePlaceholder && image == null && <span>{namePlaceholder}</span>}
        </div>
        <div className="product-name">{name}</div>
    </div>
);


function Montagem() {
    const partTypes = ['Processador', 'Placa Mãe', 'Placa de Vídeo', 'Memória RAM', 'Armazenamento', 'Fonte'];
    const [activePart, setActivePart] = useState('Processador');
    const { usuarioLogado } = useContext(GlobalContext);

    const [availableParts, setAvailableParts] = useState([]);

    // 🚩 1. ESTADO INICIAL SIMPLIFICADO: RAM não tem mais objeto com 'peca'/'quantidade'
    const [selectedParts, setSelectedParts] = useState({
        'Processador': null,
        'Placa Mãe': null,
        'Placa de Vídeo': null,
        'Memória RAM': null, // Agora é tratada como qualquer outra peça única
        'Armazenamento': null,
        'Fonte': null
    });
    
    // 🚩 FUNÇÃO DE SELEÇÃO: JÁ ESTÁ SIMPLIFICADA (manter)
    const handlePartSelection = (type, part) => {
        setSelectedParts(prevParts => ({
            ...prevParts,
            [type]: part 
        }));
    };

    // 🚩 FUNÇÃO DE REMOÇÃO: JÁ ESTÁ SIMPLIFICADA (manter)
    const handleRemovePart = (partType) => {
        setSelectedParts(prevParts => ({
            ...prevParts,
            [partType]: null 
        }));
    };

    // 🚩 2. USEMEMO SIMPLIFICADO: Remove a lógica de quantidade da RAM
    const { totalConsumption, totalPrice, psuCapacity } = useMemo(() => {
        const partsArray = Object.entries(selectedParts);

        let consumptionWithoutPSU = 0;
        let psuWattage = 0;
        let totalPrice = 0;

        partsArray.forEach(([partType, part]) => {
            if (!part) return;
            
            // Item e Quantity são simples agora
            let item = part; 
            let quantity = 1; // A quantidade é sempre 1

            // Não precisa de verificação `if (!item) return;` pois 'part' já é checado

            totalPrice += (parseFloat(item.preco) || 0);

            if (partType === 'Fonte') {
                psuWattage = parseFloat(item.watts_consumidos) || 0;
            } else {
                consumptionWithoutPSU += (parseFloat(item.watts_consumidos) || 0);
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


    // 🚩 4. LÓGICA DE SALVAR SIMPLIFICADA: Remove a lógica de múltiplos itens para RAM
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


        // Simplesmente mapeia todas as peças selecionadas
        Object.entries(selectedParts).forEach(([tipo, peca]) => {
            if (peca) {
                dataToSave.pecas.push({
                    id_peca: peca.id_peca,
                    tipo: tipo,
                    // Quantidade é sempre 1 aqui
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
                                    image={peca.link_imagem}
                                    name={peca.modelo}
                                    namePlaceholder={peca.modelo}
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
                            {/* 🚩 5. SIDEBAR SIMPLIFICADA: Remove a condicional de RAM */}
                            {selectedParts[activePart] ? selectedParts[activePart].modelo : 'Nenhuma peça selecionada'}
                        </h3>
                        <div className="part-details">
                            {selectedParts[activePart] ?
                                <div>
                                    {/* 🚩 5. SIDEBAR SIMPLIFICADA: Remove a condicional de RAM */}
                                    <p>PREÇO ESTIMADO: R$ {selectedParts[activePart].preco}</p>
                                    <p>CONSUMO: {selectedParts[activePart].watts_consumidos}W</p>
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
                                const isSelected = !!partEntry; // Verifica se há uma peça (objeto)

                                // O nome da peça é sempre o modelo se estiver selecionado
                                let partName = isSelected ? partEntry.modelo : 'Não selecionado';

                                return (
                                    // Adicionando justify-content: space-between para alinhar texto e botão
                                    <p className='text-listen' key={type} style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                        
                                        <span>
                                            <strong>{type}:</strong> {partName}
                                        </span>
                                        {isSelected && (
                                            <span 
                                                onClick={() => handleRemovePart(type)} 
                                                className="remove-part-button" // Usando uma classe para estilizar
                                                title={`Remover ${type}`}
                                            >
                                                <IoIosRemoveCircle />
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
                        <h3 className="consumption-title">CONSUMO ENERGÉTICO</h3>
                        
                        <ConsumptionGauge 
                            value={parseFloat(totalConsumption) || 0} 
                            max={parseFloat(psuCapacity) || 0} 
                        />

                        <div className="consumption-summary">
                            <p className="main-consumption-text">
                                <strong style={{color: 'var(--texto-principal)'}}>
                                    {totalConsumption}W
                                </strong> 
                                / {psuCapacity > 0 ? `${psuCapacity.toFixed(1)}W` : '??W'}
                            </p>
                            
                            {selectedParts['Fonte'] && psuCapacity > 0 ? (
                                (() => {
                                    const consumo = parseFloat(totalConsumption);
                                    const folga = (parseFloat(psuCapacity) - consumo);
                                    const corFolga = folga < 0 ? 'var(--erro)' : 'var(--destaque)';
                                    const textoStatus = folga < 0 ? 'FALTA' : 'SOBRANDO';
                                    const valorExibido = Math.abs(folga).toFixed(1);

                                    return (
                                        <p style={{ margin: 0, fontSize: '1rem', color: corFolga, fontWeight: 'bold' }}>
                                            {textoStatus} {valorExibido}W
                                        </p>
                                    );
                                })()
                            ) : (
                                <p style={{ margin: 0, fontSize: '1rem', color: 'var(--sub-texto)' }}>
                                    Selecione uma Fonte
                                </p>
                            )}
                        </div>
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