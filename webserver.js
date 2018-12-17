var http = require('http');
const nedb = require('nedb');
const db = new nedb({
  filename: '/root/shorturl.db',
  autoload: true
});

var server = http.createServer(function (req, res) {

        res.writeHead(200,{'Content-Type':'text/html'});

        if (req.url.startsWith("/a="))
        {
                var url = req.url.substring(3);
                if (!url.startsWith("http"))
                        url = "http://" + url;

                db.findOne({
                        url: url
                }, (err,ret) => {
                        if(ret != null)
                        {
                                res.write("already exists!");  res.end()
                        }
                        else
                        {
                                res.write(url + "<br/>");
                                db.insert({
                                        url: url
                                }, (err, ret) => {
                                        var p_url = "http://192.168.11.172:8888/r=" + ret._id;
                                        res.write(ret._id);
                                        res.write("<form><input onclick=myFunction(); id=myInput size=80 type=text value=" + p_url + "></form>");
                                        res.write("<script> function myFunction() { var copyText = document.getElementById(\"myInput\"); copyText.select(); document.execCommand(\"copy\");  } </script>");
                                        res.end();
                                });
                        }
                });

        }
        else if (req.url.startsWith("/r="))
        {
                var url = req.url.substring(3);
                try
                {
                         //res.write(req.url.substring(3));
                        db.findOne({
                         _id: req.url.substring(3)
                        }, (err, ret) => { try {
                                res.write("<script>document.location.href=\"" + ret.url + "\"; </script>"); res.end();
                        } catch (er) { res.write("not found"); res.end(); }
                        });
                }
                catch (err) { res.write("not found"); res.end(); }
        }
        else
        {
                db.find({}, (err,ret) => {
                        res.write("<table border=1 width=800>");
                        for (var i=0; i < ret.length; i++)
                        {
                                if (ret[i].url.length > 80) ret[i].url=ret[i].url.substring(0,80);
                                res.write("<tr>");
                                res.write("<td><a href=\"/r=" + ret[i]._id + "\">" + ret[i]._id + "</a></td><td>" + ret[i].url + "</td>" );
                                res.write("</tr>");
                        }
                        res.end();
                } );
        }
});
server.listen(8888);
console.log('Node.js web server at port 8888 is running..')
