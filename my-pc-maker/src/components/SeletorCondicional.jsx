import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../contexts/globalContext'; // Importe seu contexto
import Swal from 'sweetalert2';
import "./SeletorCondicional.css"; // Seus estilos aprimorados
import ConfirmationAlert from './Alerts/ConfirmationAlert';

function SeletorCondicional() {
    // Acesso ao contexto para obter o usuário logado
    const { usuarioLogado } = useContext(GlobalContext);

    const [configuracoes, setConfiguracoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);




    const deletarConfiguracao = async (id_computador, index) => {
        Swal.fire({
            title: `Excluir Montagem #${index + 1}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "var(--separacao)",
            confirmButtonText: "Sim, Excluir!",
            cancelButtonText: "Cancelar",
            background: "var(--fundo)",
            color: "var(--texto-principal)",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const deleteUrl = `https://my-pc-maker-cq8f.vercel.app/api/computador/${id_computador}`;

                    const response = await fetch(deleteUrl, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    ConfirmationAlert({titulo:"Sucesso", texto:"Configuração deletada com sucesso!", tempo: 1500, posicao: "top", toaster: true});
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Falha ao deletar a configuração.');
                    }

                    setConfiguracoes(prevConfigs =>
                        prevConfigs.filter(config => config.id_computador !== id_computador)
                    );



                } catch (err) {
                    console.error("Erro ao deletar configuração:", err);
                    Swal.fire({
                        title: "Erro!",
                        text: err.message || "Não foi possível deletar a configuração.",
                        icon: "error",
                        background: "var(--fundo)",
                        color: "var(--texto-principal)",
                    });
                }
            }
        });
    };


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

            <div className="seletor-bar">
                <p>Minhas Montagens Salvas</p>
            </div>

            <div className="seletor-content">

                {loading && <p>Carregando configurações...</p>}



                {!loading && !error && configuracoes.length === 0 && (
                    <h3>Você não tem nenhuma configuração salva. Vá para a tela de montagem para criar uma!</h3>
                )}

                {!loading && !error && configuracoes.map((config, index) => (
                    <div key={config.id_computador} className="config-card">
                        <div className="config-card-header">
                            <h4>Montagem  {index + 1}</h4>
                            <button
                                onClick={() => deletarConfiguracao(config.id_computador, index)}
                                className="button-excluir"
                                style={{width: '35%'}}
                                title="Excluir Montagem"
                            >
                                Excluir
                            </button>
                        </div>


                        <p><strong>Preço Estimado:</strong> R$ {config.preco_estimado}</p>
                        <p><strong>Consumo Total:</strong> {config.potencia_necessaria}W</p>

                        <details>
                            <summary>Ver Peças Selecionadas ({config.pecas.length} tipos)</summary>
                            <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>

                                {config.pecas.map((peca, pecaIndex) => (
                                    <li key={pecaIndex} style={{ listStyleType: 'disc' }}>
                                        {peca.tipo}: <strong>{peca.modelo}</strong>

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