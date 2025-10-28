const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',      // Altere para o nome do seu user no MySQL
    password: 'senai',    // Altere para a senha correta
    database: 'mpcm',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.use(cors());
app.use(express.json());

app.get('/usuario', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM usuario');
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar usuarios' });
    }
});

app.get('/usuario/:email', async (req, res) => {
    const {email} = req.params
    try {
        const [rows] = await pool.query('SELECT * FROM usuario WHERE email = ?', [email]);
        res.json(rows[0]);
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
        res.json(rows[0]);
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
            'UPDATE clientes SET nome = ?, endereco = ?, senha = ?, email = ? WHERE id_usuario = ?',
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
