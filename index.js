const odbc = require("odbc");
require("dotenv").config();

async function connectToDatabase() {
  const connection = await odbc.connect(process.env.CONNECTION_STRING);
  return connection;
}

async function execQuery(query) {
  const connectionConfig = {
    connectionString: process.env.CONNECTION_STRING,
    reuseConnections: true, // Réutiliser une connexion du pool (sans en récréer une)
  };
  const pool = await odbc.pool(connectionConfig);
  const result = await pool.query(query);

  // Extrait uniquement les lignes requêtées (pas d'infos supplémentaires)
  let retArray = new Array();
  for (let index = 0; index < result.length; index++) {
    retArray.push(result[index]);
  }
  return retArray;
}

async function simpleQuery() {
  // Pas utilisé : créer un 'odbc.pool()' établit bien déjà une connexion
  // const cn = await connectToDatabase();
  // if (!cn) throw error;

  let myQuery = `SELECT * FROM fillcasg --WHERE FCPER = 202411`;

  const result = await execQuery(myQuery);
  console.log(result);

  // Pas utilisé : créer un 'odbc.pool()' établit bien déjà une connexion
  // await cn.close();
}

// can only use await keyword in an async function
async function simpleCursor() {
  const connection = await odbc.connect(process.env.CONNECTION_STRING);
  const cursor = await connection.query("SELECT * FROM fillcasg", {
    cursor: true,
  });
  // As long as noData is false, keep calling fetch
  while (!cursor.noData) {
    const result = await cursor.fetch();
    const filCasg = result[0];
    if (filCasg) {
      if (filCasg.FCPER == 202411) {
        console.log(`Coeff Novembre 2024: ${filCasg.FCCOEFSZF}`);
      }
    }
  }
  await cursor.close();
}

// Requête simple
simpleQuery();

// Curseur -- TODO: connexion mal fermée ?
simpleCursor();
