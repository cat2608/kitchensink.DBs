/* eslint-disable no-console */
import couchbase from 'couchbase';
import ottoman from 'ottoman';
import config from './config';

const cluster = new couchbase.Cluster(config.server.db.url);

ottoman.bucket = cluster.openBucket(config.server.db.bucket, (err) => {
  if (err) {
    console.log('\u001B[31m' + err.message + '\x1b[0m');
  } else {
    console.log(`\u001B[32mDB ${config.server.db.url}/${config.server.db.bucket} \x1b[0m`);
  }
});
