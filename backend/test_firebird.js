const Firebird = require('node-firebird');

const options = {
  host: '127.0.0.1',
  port: 3050,
  database: 'C:/Users/Guilherme/Documents/ProjetoFabiano/db_projeto/clientes.fdb', // caminho correto
  user: 'SYSDBA',
  password: '2468', // senha que você confirmou no ISQL
  role: null,
  pageSize: 4096,
  wireCrypt: 0 // sem criptografia
};

Firebird.attach(options, (err, db) => {
  if (err) {
    console.error('Erro ao conectar ao Firebird:', err.message);
    console.error('GDSCODE:', err.gdscode);
    console.error('Verifique o firebird.log para detalhes adicionais.');
    return;
  }

  console.log('Conectado ao Firebird com sucesso!');

  db.query(
    "SELECT rdb$get_context('SYSTEM','ENGINE_VERSION') AS VERSION FROM RDB$DATABASE",
    (err, result) => {
      if (err) {
        console.error('Erro ao executar query:', err);
      } else {
        console.log('Versão do Firebird:', result[0].VERSION);
      }
      db.detach();
    }
  );
});
