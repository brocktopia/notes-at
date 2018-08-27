# notes-at RESTful API

In order to get this app working properly on my phone I had to 
get it running over ```https://``` so that maps would render in
Chrome. I'm currently developing this app using a local Apache 
server and I configured it to use SSL. I'm only using Node in this 
project for services. That meant I had to run my services over 
```https://```. To do that I created an alternate version of 
```server.js``` [api/server-ssl.js](api/server-ssl.js). This
process requires the certificate and private key I'm using for
SSL in my Apache server. I've copied those files to a ```keys``` 
subdirectory of this directory ```/api/keys/```. I point to those 
files on lines 18,19 of [api/server-ssl.js](api/server-ssl.js).

```js
  sslPort = 3031,
  privateKey = fs.readFileSync('key/YOUR_PRIVATE_KEY.key'),
  certificate = fs.readFileSync('key/YOUR_CERTIFICATE.crt'),
  dbName = 'NotesAtDB',
``` 

Anyone using a similar configuration should be able to do the same
by copying their keys over and modifying the paths to those files in 
[api/server-ssl.js](api/server-ssl.js). After than either modify the
```"start"``` script in [package.json](../package.json) to point to 
```server-ssl.js``` or rename ```server-ssl.js``` to ```server.js```.