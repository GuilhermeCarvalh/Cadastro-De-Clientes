const { attach } = require('./db/firebird');

async function test() {
  try {
    const db = await attach();
    console.log('Conexão com Firebird bem-sucedida!');
    db.detach();
  } catch (err) {
    console.error('Erro ao conectar ao Firebird:', err.message);
  }
}

test();
