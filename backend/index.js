const express = require('express');
const cors = require('cors');
const { attach } = require('./db/firebird'); // seu arquivo de conexão

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// Listar todos os clientes
app.get('/clientes', async (req, res) => {
  try {
    const db = await attach();
    db.query('SELECT * FROM CLIENTE', (err, result) => {
      db.detach();
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar cliente
app.post('/clientes', async (req, res) => {
  const { NOME, EMAIL, TELEFONE, SALARIO } = req.body;

  // Validação de campos obrigatórios
  if (!NOME || !EMAIL || !TELEFONE || SALARIO == null) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    const db = await attach();
    const sql = 'INSERT INTO CLIENTE (NOME, EMAIL, TELEFONE, SALARIO) VALUES (?, ?, ?, ?)';
    db.query(sql, [NOME, EMAIL, TELEFONE, SALARIO], (err) => {
      db.detach();
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Cliente criado com sucesso!' });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar cliente (campo a campo)
app.put('/clientes/:id', async (req, res) => {
  const { id } = req.params;
  const { NOME, EMAIL, TELEFONE, SALARIO } = req.body;

  if (!id) return res.status(400).json({ error: 'ID é obrigatório!' });

  // Monta a query dinamicamente com campos enviados
  const updates = [];
  const params = [];

  if (NOME !== undefined) {
    if (!NOME) return res.status(400).json({ error: 'Campo NOME não pode estar vazio!' });
    updates.push('NOME=?');
    params.push(NOME);
  }

  if (EMAIL !== undefined) {
    if (!EMAIL) return res.status(400).json({ error: 'Campo EMAIL não pode estar vazio!' });
    updates.push('EMAIL=?');
    params.push(EMAIL);
  }

  if (TELEFONE !== undefined) {
    if (!TELEFONE) return res.status(400).json({ error: 'Campo TELEFONE não pode estar vazio!' });
    updates.push('TELEFONE=?');
    params.push(TELEFONE);
  }

  if (SALARIO !== undefined) {
    if (SALARIO == null) return res.status(400).json({ error: 'Campo SALARIO não pode estar vazio!' });
    updates.push('SALARIO=?');
    params.push(SALARIO);
  }

  if (updates.length === 0) return res.status(400).json({ error: 'Nenhum campo para atualizar!' });

  params.push(id);

  try {
    const db = await attach();
    const sql = `UPDATE CLIENTE SET ${updates.join(', ')} WHERE ID=?`;
    db.query(sql, params, (err) => {
      db.detach();
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Cliente atualizado com sucesso!' });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar cliente
app.delete('/clientes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const db = await attach();
    const sql = 'DELETE FROM CLIENTE WHERE ID=?';
    db.query(sql, [id], (err) => {
      db.detach();
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Cliente removido com sucesso!' });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
