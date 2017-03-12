const { parse } = require('csv');
const { defaultsDeep, set, zipObject, assignIn } = require('lodash');

const recordParsingKeys = ['channel', 'persona', 'dataname', 'duration', 'percent'];

module.exports = ({ stringStream, parserOptions, meta }) =>
  new Promise((resolve, reject) => {
    const pOptions = defaultsDeep(parserOptions, {
      delimiter: ';',
    });
    const output = { meta, data: [] };
    const parser = parse(pOptions);

    parser.on('error', err => reject(err));

    parser.on('readable', () => {
      let record = null;
      do {
        record = parser.read();
        if (record) {
          const parsedRecord = zipObject(recordParsingKeys, record);
          const entry = {};
          set(entry,
            `${parsedRecord.channel}.${parsedRecord.persona}.${parsedRecord.dataname}.temps`,
            parsedRecord.duration);
          set(entry,
            `${parsedRecord.channel}.${parsedRecord.persona}.${parsedRecord.dataname}.pourcentage`,
            parsedRecord.percent);
          console.log(entry);
          assignIn(output.data, entry);
        }
      } while (record);
    });
    console.log(output);

    parser.on('finish', () => resolve(output));

    stringStream.pipe(parser);
  });
