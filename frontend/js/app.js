const form = document.getElementById('formCliente');
const tabela = document.querySelector('#tabelaClientes tbody');

let clientes = [];
let editandoId = null;

// Função para listar clientes
async function listarClientes() {
  try {
    const res = await fetch('http://localhost:3000/clientes');
    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error('Resposta inesperada do servidor:', data);
      return;
    }

    clientes = data;

    tabela.innerHTML = '';

    clientes.forEach(cliente => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${cliente.ID}</td>
        <td>${cliente.NOME}</td>
        <td>${cliente.EMAIL}</td>
        <td>${cliente.TELEFONE}</td>
        <td>${cliente.SALARIO}</td>
        <td>
          <button onclick="editarCliente(${cliente.ID})">Editar</button>
          <button onclick="deletarCliente(${cliente.ID})">Excluir</button>
        </td>
      `;
      tabela.appendChild(row);
    });
  } catch (err) {
    console.error('Erro ao listar clientes:', err);
  }
}

// Função para criar ou atualizar cliente
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const salario = document.getElementById('salario').value.trim();

  // Mantém valores anteriores se estiver editando e algum campo estiver vazio
  let clienteAtual = clientes.find(c => c.ID === editandoId) || {};
  
  const payload = {
    NOME: nome || clienteAtual.NOME || '',
    EMAIL: email || clienteAtual.EMAIL || '',
    TELEFONE: telefone || clienteAtual.TELEFONE || '',
    SALARIO: salario || clienteAtual.SALARIO || 0
  };

  try {
    if (editandoId) {
      await fetch(`http://localhost:3000/clientes/${editandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      await fetch('http://localhost:3000/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    editandoId = null;
    form.reset();
    listarClientes();
  } catch (err) {
    console.error('Erro na requisição:', err);
  }
});

// Função para editar cliente
function editarCliente(id) {
  editandoId = id;
  const cliente = clientes.find(c => c.ID === id);
  if (!cliente) return;

  document.getElementById('nome').value = cliente.NOME;
  document.getElementById('email').value = cliente.EMAIL;
  document.getElementById('telefone').value = cliente.TELEFONE;
  document.getElementById('salario').value = cliente.SALARIO;
}

// Função para deletar cliente
async function deletarCliente(id) {
  if (!confirm('Deseja realmente excluir este cliente?')) return;
  
  try {
    await fetch(`http://localhost:3000/clientes/${id}`, { method: 'DELETE' });
    listarClientes();
  } catch (err) {
    console.error('Erro ao deletar cliente:', err);
  }
}

// Chama a lista ao carregar a página
document.addEventListener('DOMContentLoaded', listarClientes);
