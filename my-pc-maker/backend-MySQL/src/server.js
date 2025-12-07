const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require("dotenv").config()

const app = express();
const router = express.Router();

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,      // Altere para o nome do seu user no MySQL
    password: process.env.PASSWORD,    // Altere para a senha correta
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    port: process.env.PORT
});

app.use(cors());
app.use(express.json());
app.use('/api', router)

app.get('/usuario', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM usuario');
        res.status(200).json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar usuarios' });
    }
});

app.get('/usuario/:email', async (req, res) => {
    const {email} = req.params
    console.log(req.params)
    try {
        const [rows] = await pool.query('SELECT * FROM usuario WHERE email = ?', [email]);
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar usuarios' });
    }
});



app.get('/usuario/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM usuario WHERE id_usuario = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario não encontrado' });
        }
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar cliente' });
    }
});




app.post('/usuario', async (req, res) => {
    const { nome, senha, email } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO usuario (nome, senha, email) VALUES (?, ?, ?)',
            [nome, senha, email]
        );
        const [novoUsuario] = await pool.query('SELECT * FROM usuario WHERE id_usuario = ?', [result.insertId]);
        res.status(201).json(novoUsuario[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao adicionar usuário' });
    }
});

app.put('/usuario/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, bio, imagem_link } = req.body;

  try {
    // Se o usuário mandou senha nova E não está vazia
    if (senha && senha.trim() !== "") {
      const [result] = await pool.query(
        "UPDATE usuario SET nome = ?, email = ?, senha = ?, bio = ?, imagem_link = ? WHERE id_usuario = ?",
        [nome, email, senha, bio, imagem_link, id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
    } else {
      // Atualizar sem mexer na senha
      const [result] = await pool.query(
        "UPDATE usuario SET nome = ?, email = ?, bio = ?, imagem_link = ? WHERE id_usuario = ?",
        [nome, email, bio, imagem_link, id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
    }

    const [usuarioAtualizado] = await pool.query(
      "SELECT * FROM usuario WHERE id_usuario = ?",
      [id]
    );

    res.json(usuarioAtualizado[0]);

  } catch (err) {
    console.error("ERRO MYSQL:", err);
    res.status(500).json({ error: "Erro ao atualizar cliente" });
  }
});


app.delete('/usuario/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM usuario WHERE id_usuario = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario não encontrado' });
        }
        res.json({ message: 'Usuario deletado com sucesso' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao deletar usuario' });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});


app.get('/api/pecas', async (req, res) => {
    const { tipo } = req.query;

    if (!tipo) {
        return res.status(400).json({ error: 'O parâmetro "tipo" é obrigatório.' });
    }

    try {
        const [rows] = await pool.query(
            'SELECT id_peca, tipo, modelo, preco, watts_consumidos, link_imagem FROM peca WHERE tipo = ?',
            [tipo]
        );
        
        // Retorna a lista de peças
        res.status(200).json(rows);
    } catch (err) {
        console.error("Erro ao buscar peças:", err.message);
        res.status(500).json({ error: 'Erro interno ao buscar peças' });
    }
});


router.post('/computador', async (req, res) => {
    const { potencia_necessaria, preco_estimado, usuario_id, pecas } = req.body;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [resultComputador] = await connection.query(
            'INSERT INTO computador (potencia_necessaria, preco_estimado, usuario_id) VALUES (?, ?, ?)',
            [potencia_necessaria, preco_estimado, usuario_id]
        );

        const computadorId = resultComputador.insertId;

      
        const insertedPecaIds = new Set();
        const pecasToInsert = [];
        
        pecas.forEach(peca => {
            if (!insertedPecaIds.has(peca.id_peca)) {
                pecasToInsert.push([
                    computadorId,
                    peca.id_peca
                ]);
                insertedPecaIds.add(peca.id_peca);
            }
        });

        if (pecasToInsert.length > 0) {
            const sqlPecas = 'INSERT INTO computador_has_peca (computador_id, peca_id) VALUES ?';
            await connection.query(sqlPecas, [pecasToInsert]);
        }

        await connection.commit();
        
        res.status(201).json({ 
            message: 'Configuração salva com sucesso!', 
            id_computador: computadorId 
        });

    } catch (error) {
        await connection.rollback();
        console.error("ERRO ao salvar configuração (Transação Revertida):", error);
        res.status(500).json({ error: "Erro interno ao salvar a configuração e suas peças." });
    } finally {
        connection.release();
    }
});


router.get('/computador/usuario/:id', async (req, res) => {
    const { id: userId } = req.params;

    try {
        const sqlConfigs = 'SELECT id_computador, potencia_necessaria, preco_estimado FROM computador WHERE usuario_id = ?';
        const [configsBasicas] = await pool.query(sqlConfigs, [userId]);

        if (configsBasicas.length === 0) {
            return res.status(200).json([]);
        }

        const configsComPecas = await Promise.all(
            configsBasicas.map(async (config) => {
                
                const sqlPecas = `
                    SELECT 
                        p.modelo,
                        p.tipo
                    FROM 
                        peca p
                    INNER JOIN 
                        computador_has_peca cp ON p.id_peca = cp.peca_id
                    WHERE 
                        cp.computador_id = ?;
                `;
                
                const [pecas] = await pool.query(sqlPecas, [config.id_computador]); 
                
                return {
                    ...config,
                    preco_estimado: parseFloat(config.preco_estimado).toFixed(2),
                    potencia_necessaria: parseFloat(config.potencia_necessaria).toFixed(1),
                    pecas: pecas || []
                };
            })
        );
        
        res.status(200).json(configsComPecas); 
        
    } catch (error) {
        console.error("ERRO CRÍTICO NA BUSCA DE CONFIGURAÇÕES:", error);
        res.status(500).json({ error: "Erro interno ao buscar as configurações." });
    }
});


router.delete('/computador/:id', async (req, res) => {
    const { id: computadorId } = req.params;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

    
        await connection.query('DELETE FROM computador_has_peca WHERE computador_id = ?', [computadorId]);

        const [result] = await connection.query('DELETE FROM computador WHERE id_computador = ?', [computadorId]);

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Configuração de PC não encontrada' });
        }

        await connection.commit();
        res.status(200).json({ message: 'Configuração deletada com sucesso' });

    } catch (error) {
        await connection.rollback();
        console.error("ERRO ao deletar configuração (Transação Revertida):", error);
        res.status(500).json({ error: "Erro interno ao deletar a configuração." });
    } finally {
        connection.release();
    }
});