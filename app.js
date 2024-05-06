import path from 'path';
import fs from 'fs';
import { parse } from 'csv-parse';

import { MongoClient } from 'mongodb';

const directoryPath = '/home/rldourado/work/rld/postgres-audit-files/files';

processCSVDIRECTORY(directoryPath)
  .then(() => console.log('Todos os arquivos CSV processados com sucesso!'))
  .catch((error) => console.error('Erro ao processar arquivos CSV:', error));

async function processCSVDIRECTORY(directoryPath) {
  const files = fs.readdirSync(directoryPath);

  for (const fileName of files) {
    const filePath = path.join(directoryPath, fileName);

    if (await isFileProcessed(filePath)) {
      console.log(`Arquivo ${fileName} já processado, pulando...`);
      continue;
    }

    console.log(`Processando arquivo ${fileName}...`);

    await processCSVFile(filePath);
  }
}

async function isFileProcessed(filePath) {
  const client = await MongoClient.connect('mongodb://root:example@localhost:27017');
  const db = client.db('csv_processor');
  const collection = db.collection('processed_files');

  const fileExists = await collection.findOne({ filePath });

  await client.close();

  return fileExists !== null;
}

async function processCSVFile(filePath) {
  const records = await readCSVFile(filePath);

  const client = await MongoClient.connect('mongodb://root:example@localhost:27017');
  const db = client.db('csv_data');
  const collection = db.collection('csv_records');

  await collection.insertMany(records);

  await client.close();

  await markFileAsProcessed(filePath);
}

async function markFileAsProcessed(filePath) {
  const client = await MongoClient.connect('mongodb://root:example@localhost:27017');
  const db = client.db('csv_processor');
  const collection = db.collection('processed_files');

  await collection.insertOne({ filePath });

  await client.close();
}

async function readCSVFile(filePath) {
  const records = [];

  const parser = parse({ delimiter: ',' });

  const stream = fs.createReadStream(filePath);

  stream.on('data', (data) => parser.write(data));

  parser.on('data', (record) => records.push(record));

  await new Promise((resolve, reject) => {
    stream.on('end', resolve);
    stream.on('error', reject);
  });

  return records;
}
