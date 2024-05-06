import { parse } from 'csv-parse';
import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import PostgresAudit from './model/audit.js';
import ProcessedFiles from './model/processedFiles.js';

const directoryPath = '/home/rldourado/work/rld/postgres-audit-files/files';

const main = async () => {

  // connect to db
  mongoose.connect('mongodb://root:example@localhost:27017', {
    dbName: 'csv_processor',
  });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  const files = fs.readdirSync(directoryPath);

  for (const fileName of files) {
    const filePath = path.join(directoryPath, fileName);

    if (await ProcessedFiles.findOne({ filePath })) {
      console.log(`Arquivo ${fileName} já processado, pulando...`);
      continue;
    }

    console.log(`Processando arquivo ${fileName}...`);

    // read csv file
    const records = [];
    fs.createReadStream(filePath)
      .pipe(parse({ headers: false }))
      .on('error', error => console.error(error))
      .on('data', function(data) {
        const record = {}
        record['_id'] = new mongoose.Types.ObjectId();
        record['timestamp'] = data[0]
        record['user'] = data[1]
        record['database'] = data[2]
        record['field01'] = data[3]
        record['clientIP'] = data[4]
        record['field02'] = data[5]
        record['field03'] = data[6]
        record['operation'] = data[7]
        record['field04'] = data[8]
        record['field05'] = data[9]
        record['field06'] = data[10]
        record['field07'] = data[11]
        record['field08'] = data[12]
        record['field09'] = data[13]
        record['field10'] = data[14]
        record['field11'] = data[15]
        record['field12'] = data[16]
        record['field13'] = data[17]
        record['field14'] = data[18]
        record['field15'] = data[19]
        record['field16'] = data[20]
        record['field17'] = data[21]
        record['clientName'] = data[22]
        record['field18'] = data[23]
        record['field19'] = data[24]
        record['field20'] = data[25]
        record['field21'] = data[26]

        // console.log(record);
        records.push(record);
      })
      .on('end', function(){
        // insert audits into db
        PostgresAudit.insertMany(records)
          .then(() => {
            console.log(`${records.length} + records have been successfully uploaded.`)
            ProcessedFiles.create({ filePath })
          })
          .catch((error) => console.error('Error inserting audits:', error));
        
        return;
      });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit();
});
