// backend/db/firebird.js
const Firebird = require('node-firebird');

const options = {
  host: '127.0.0.1',
  port: 3050,
  // Caminho corrigido: use barras duplas \\ ou simples /
  database: 'C:/Users/Guilherme/Documents/ProjetoFabiano/db_projeto/clientes.fdb', // caminho do seu banco
  user: 'SYSDBA',
  password: '2468', // senha ajustada
  role: null,
  pageSize: 4096
};

function attach() {
  return new Promise((resolve, reject) => {
    Firebird.attach(options, (err, db) => {
      if (err) return reject(err);
      resolve(db);
    });
  });
}

module.exports = { attach };
