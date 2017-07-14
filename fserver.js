const http = require('http');
const fs = require('fs');
const url= require('url');
const path= require('path');
let store={
  items  :  {},
  setItem:  function(item){
              this.items[item.__id]=item;
            },
  getItem:  function(id){
              return this.items[id];
            },
  removeItem: function(id){
                delete this.items[id];
              }
};
http.createServer(function (req, res) {
  const parsedUrl= url.parse(req.url);
  const uri = parsedUrl.pathname.slice(1) ;
  const parsedPath = parsedUrl.pathname;
  if(uri==='users'){
    if (req.method === 'POST') {
      var body = '';
      req.on('data', function (data) {
        body += data;
      });
      const randNum=Math.random()*10000;
      const randId=Math.round(randNum);
      req.on('end', function () {
        const data = JSON.parse(body);
        data.__id=randId;
        store.setItem(data);
        res.end(JSON.stringify(data));
      });
      return;
    };
    if (req.method === 'PUT') {
      var body = '';
      req.on('data', function (data) {
        body += data;
      });
      req.on('end', function () {
        const data = JSON.parse(body);
        if(store.getItem(data.__id))
          store.setItem(data);
        res.end();
      });
      return;
    };
    if(req.method === 'GET'){
      res.end(JSON.stringify(store.items));
      return;
    };
    return;
  };
  if (parsedPath.indexOf('/users') === 0 && parsedPath.length > 7){
    if(req.method === 'GET'){
      const findById=parsedPath.slice(7);
      const stringId=findById.toString();             
      const result= store.getItem(stringId);
      res.end(JSON.stringify(result));
      return;
    };
    if(req.method === 'DELETE'){
      const findById=parsedPath.slice(7); 
      const stringId=findById.toString();
      store.removeItem(stringId);
      res.end();
      return;
    };
    return;
  };
  fs.readFile(uri, function(err, file) {
    if(err) {        
      res.writeHead(500, {"Content-Type": "text/plain"});
      res.write(err + "\n");
      res.end();
      return;
    };
    res.write(file);
    res.end();
  });
}).listen(3010);