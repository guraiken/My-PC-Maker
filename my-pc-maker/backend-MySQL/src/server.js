const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require("dotenv").config()

const app = express();
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
    const { nome, senha, email,  } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE usuario SET nome = ?, endereco = ?, senha = ?, email = ? WHERE id_usuario = ?',
            [nome, senha, email, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        const [usuarioAtualizado] = await pool.query('SELECT * FROM usuario WHERE id_usuario = ?', [id]);
        res.json(usuarioAtualizado[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao atualizar cliente' });
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
        // Consulta o banco de dados filtrando pelo TIPO
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