const nedb = require('nedb');
const db = new nedb({
  filename: '/root/shorturl.db',
  autoload: true
});

//db.insert({
// name: 'tom'
//}, (err, ret) => {});


db.find({
  _id: 'ht04WTcNhRW50e48'
}, (err, ret) => { console.log(ret);  });

//db.remove({
//  name: 'tom'
//}, (err,ret) => {});
