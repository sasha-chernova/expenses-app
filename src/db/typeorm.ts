import {Connection, createConnection} from 'typeorm';

let connection: Connection;

export const getDBConnection = async function getDB(): Promise<Connection> {
  if (!connection) {
    connection = await getNewConnection();
  }

  return connection;
};

const MAX_RETRIES = 10;
let tries = 0;

const tryToConnect = async (): Promise<Connection> => {
  return new Promise(async (resolve, reject) => {
    try {
      return resolve(createConnection());
    } catch (e) {
      if (tries < MAX_RETRIES) {
        ++tries;
        return setTimeout(() => tryToConnect().then(resolve).catch(reject), 1000);
      }
      return reject(e);
    }
  });
};

const getNewConnection = async () => {
  return await tryToConnect();
};
