import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../contexts/globalContext'; // Importe seu contexto
import "./SeletorCondicional.css"; // Seus estilos aprimorados

function SeletorCondicional() {
    // Acesso ao contexto para obter o usuário logado
    const { usuarioLogado } = useContext(GlobalContext); 
    
    const [configuracoes, setConfiguracoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!usuarioLogado || !usuarioLogado.id_usuario) {
            setError("Você precisa estar logado para ver suas montagens.");
            setLoading(false);
            return;
        }

        const fetchConfiguracoes = async () => {
            setLoading(true);
            setError(null);
            const userId = usuarioLogado.id_usuario;

            try {
                // 1. Chamada à API para buscar as configurações do usuário
                const response = await fetch(`https://my-pc-maker-cq8f.vercel.app/api/computador/usuario/${userId}`);
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Falha ao buscar configurações salvas.');
                }

                const data = await response.json();
                setConfiguracoes(data);
            } catch (err) {
                console.error("Erro ao buscar configurações:", err);
                setError(err.message || "Não foi possível carregar suas configurações salvas.");
            } finally {
                setLoading(false);
            }
        };

        fetchConfiguracoes();
    }, [usuarioLogado]); 

    return (
        <div className="seletor-container">
            
            {/* 1. BARRA DE TÍTULO */}
            <div className="seletor-bar">
                <p>Minhas Montagens Salvas</p> 
            </div>

            {/* 2. CONTEÚDO (Cartões) */}
            <div className="seletor-content">
                
                {loading && <p>Carregando configurações...</p>}
                
                {error && <p style={{color: 'red', fontWeight: 'bold'}}>{error}</p>}
                
                {!loading && !error && configuracoes.length === 0 && (
                    <p>Você não tem nenhuma configuração salva. Vá para a tela de montagem para criar uma!</p>
                )}

                {/* 3. Renderização das Configurações */}
                {!loading && !error && configuracoes.map((config, index) => (
                    <div key={config.id_computador} className="config-card">
                        <h4>Montagem Salva #{index + 1}</h4>
                       
                        
                        <p><strong>Preço Estimado:</strong> R$ {config.preco_estimado}</p> 
                        <p><strong>Consumo Total:</strong> {config.potencia_necessaria}W</p> 
                        
                        <details>
                            <summary>Ver Peças Selecionadas ({config.pecas.length} tipos)</summary> 
                            <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
                                
                                {config.pecas.map((peca, pecaIndex) => (
                                    <li key={pecaIndex} style={{ listStyleType: 'disc' }}>
                                        {peca.tipo}: <strong>{peca.modelo}</strong> 
                                        
                                        {/* Exibe a quantidade (retornada pelo COUNT() do SQL) se for > 1 */}
                                        {peca.quantidade > 1 ? ` (${peca.quantidade}x)` : ''}
                                    </li>
                                ))}
                            </ul>
                        </details>
                        
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SeletorCondicional;