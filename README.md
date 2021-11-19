# TO-DO App
Proyecto de lista TO-DO para probar el stack tecnológico:
- [NodeJS](https://nodejs.org)
- [ExpressJS](https://expressjs.com/) (Framework Back-end)
- [DustJS](https://www.dustjs.com/) (Motor de plantillas)
- [Less](https://lesscss.org/) (Preprocesador CSS)

## Requisitos
- [NodeJS 16.13.x](https://nodejs.org)
- [GIT](https://git-scm.com/)

## Instalación
Clona el repositorio:
```sh
git clone git@github.com:ielizaribiko/todo-node.git
```

Muévete al directorio del proyecto
```sh
cd todo-node
```

Instala las dependencias
```sh
npm install
```

Levanta el servidor con live reload
```sh
npm run start:watch
```

## Extensiones VSCode
- [DustJS - AzkabanCoders]( https://marketplace.visualstudio.com/items?itemName=AzkabanCoders.dustjs)
- [GitLens - GitKraken](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
- [IntelliJ IDEA Keybindings - Keisuke Kato]( https://marketplace.visualstudio.com/items?itemName=k--kato.intellij-idea-keybindings)
- [HTML CSS Support - ecmel](https://marketplace.visualstudio.com/items?itemName=ecmel.vscode-html-css)

## Tutorial paso a paso (Ubuntu 20.04)
### 1. Instalar software requerido
#### NodeJS - NVM
En primer lugar instalamos Node Version Manager (NVM), a través del que podemos instalar distintas versiones de Nodejs en el sistema. En el caso de tener distintos proyectos que utilizan versiones de Nodejs diferentes, nvm nos permitirá cambiar de una a otra fácilmente según nuestras necesidades.

```sh
sudo apt update
sudo apt install curl 
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash 
source ~/.profile
nvm install 16.13.0
```

#### GIT
```sh
sudo apt update
sudo apt install git
```
Para ver la rama en la que estamos trabajando desde la consola (cuando estemos dentro de un directorio git), añadiremos estas líneas de código al final del archivo `~/.bashrc`
```sh
function parse_git_branch () {
  git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/(\1)/'
}
 
RED="\[\033[01;31m\]"
YELLOW="\[\033[01;33m\]"
GREEN="\[\033[01;32m\]"
BLUE="\[\033[01;34m\]"
NO_COLOR="\[\033[00m\]"

# without host
#PS1="$GREEN\u$NO_COLOR:$BLUE\w$YELLOW\$(parse_git_branch)$NO_COLOR\$ "
# with host
PS1="$GREEN\u@\h$NO_COLOR:$BLUE\w$YELLOW\$(parse_git_branch)$NO_COLOR\$ "
```
Para hacer efectivo el cambio será necesario reiniciar la consola o ejecutar
```sh
source ~/.bashrc
```
### 2. Iniciar el proyecto
Nos situamos en el directorio donde vayamos a almacenar nuestros proyectos, creamos el directorio de este proyecto y entramos en él.
```sh
cd ~/proyectos/demos
mkdir todo-node
cd todo-node
```
Inicializamos el proyecto node y el repositorio git
```sh
npm init
git init
```

#### ExpressJS (Back-end Framework)
Instalamos ExpressJS y creamos el esqueleto de la aplicación
```sh
npm install express --save
npx express-generator
```

#### DustJS (Template engine)
Por defecto se creará el esqueleto de expressjs configurado para utilizar el motor de plantillas Jade (proyecto continuado con el nombre PUG). El motor de plantillas DustJS no está oficialmente soportado por ExpressJS, pero tenemos varias opciones para integrarlo (https://stackoverflow.com/a/29190676):
- [Dust Helpers](https://github.com/LinkedInAttic/dustjs-helpers)
- [Adaro](https://github.com/krakenjs/adaro)
- [Consolidate](https://www.npmjs.com/package/consolidate)

Consolidate.js permite utilizar una gran variedad de template engines. Además del paquete Consolidate deberemos instalar el paquete del engine que queramos utilizar. Por el contrario **Adaro** es un plugin para usar específicamente DustJS en ExpressJS, por lo que es la opción que he elegido. Aprovecharemos también para eliminar la dependencia jade que se había generado automáticamente.

```sh
npm uninstall --save jade
npm install adaro --save-dev
```
Eliminaremos el contenido del directorio `views/` donde se habían generado las plantillas Jade con el comandop `npx express-generator` y crearemos en él dos archivos: `index.dust` y `error.dust`
```sh
rm views/*
touch views/index.dust views/error.dust
```

A continuación editamos el archivo `app.js` para añadir las siguientes líneas (la parte de _view engine setup_ deberá sustituir a las líneas que se habían generado para usar jade):
```js
var dust = require('adaro');
...
// view engine setup
app.engine('dust', dust.dust({}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'dust');
...
```
A continuación editamos el archivo `views/index.dust` y pegamos lo siguiente:
```html
<html>
    <head>
    </head>
    <body>
        hello {nombre}
    </body>
</html>
```
Por último, editamos el archivo `routes/index.js` y añadimos la propiedad `nombre` al objeto devuelto en la response de Express al acceder a la ruta `/`:
```js
res.render('index', { title: 'TO-DO App', nombre: 'Rasputin'});
```
Después de aplicar estos cambios, ejecutamos los siguientes comandos:
```sh
npm install
npm start
```
Ahora podremos cargar la página desde el navegador en la url http://localhost:3000 donde, si todo ha ido bien, deberíamos ver el mensaje "hello Rasputin".

#### Live Reload
Si hacemos algún cambio, por ejemplo cambiando `nombre: 'Rasputin'` por `nombre: 'Pepe'` y recargamos la url, veremos que no se han aplicado los cambios. Es necesario reiniciar el servidor para que se apliquen y esto no es nada cómodo. Para que se apliquen los cambios directamente sin necesidad de recargar la página ni reiniciar el servidor, utilizaremos los paquetes `nodemon`, `livereload` y `connect-livereload`.

El paquete `nodemon` se encarga de observar si se han hecho cambios en alguno de los archivos del proyecto, en cuyo caso reinicia el servidor de forma automática. 
El paquete `livereload` levanta un servidor livereload durante el inicio del servidor express que. La única función de este servidor es devolver la orden de refrescar la página en la primera conexión que recibe.
Por último, el paquete `connect-livereload` es un middleware que añade el script de livereload en las response de Express. Este script envía requests al servidor de livereload y, si recibe respuesta, recarga la página porque significa que el servidor express ha sido reiniciado.

En primer lugar, instalamos las dependencias en el proyecto:
```sh
npm install nodemon livereload connect-livereload --dev-server
```
En el archivo `app.js` añadimos las siguientes líneas:
```js
...
var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");
...
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

var app = express();
app.use(connectLiveReload());
...
```
> **IMPORTANTE**
> El archivo `views/index.dust` debe contener las cabeceras HTML básicas (html, header, body) para que se inserte el script de livereload o de lo contrario no funcionará.

El script `npx express-generator` crea el archivo `/bin/www` que es el que se ejecuta posteriormente con el comando `npm start` para levantar el servidor. No he sido capaz de de hacer funcionar `nodemon` sobre los archivos del proyecto si se inicia con ese archivo www. Por lo que lo solucioné creando un archivo `server.js` en la raíz del proyecto y copiando en él el contenido de `www`. Una vez hecho esto podemos eliminar ese archivo y su directorio:
```sh
cp ./bin/www server.js
rm -rf ./bin
```
Una vez hecho esto, deberemos modificar la ruta del archivo app.js en `server.js`:
```js
var app = require('./app');
```
Por último, modificamos la sección de scripts en `package.json` para dejarla así:
```js
"scripts": {
    "start": "node server.js",
    "start:watch": "nodemon --ext js,json,dust,css ./server.js"
  },
```
Ahora podemos parar el servidor si lo teníamos levantado y ejecutar:
```sh
npm run start:watch
```
Si teníamos cargada la página en el navegador deberemos recargarla manualmente (por última vez xD) para que se cargue con el script de livereload. A partir de ahora, cualquier cambio en los archivos js, json, dust y css provocará el reinicio del servidor y la recarga de la página.

#### LESS
Less es una extensión del lenguaje CSS. Debido a que no es CSS, es necesario preprocesarlo para generar archivos css válidos que puedan entender los navegadores. Este preprocesado lo realizamos en el servidor en el momento de su inicio, de forma que se generan los archivos css que posteriormente son enlazados por las plantillas.

Hay distintos modos de hacer este preprocesado. En este proyecto he utilizado el paquete `less-middleware` que permite integrarlo fácilmente en ExpressJS para hacer la compilación al levantar el servidor. Sin embargo podría hacerse también directamente con el paquete `less` evitándonos incluir dependencias que no sabemos si se van a seguir manteniendo en el futuro.

Primero indico el modo de usar `less-middleware`:
```sh
npm install -D less-middleware
```
En el archivo `app.js` añadir la siguiente línea antes de la línea para los archivos estáticos:
```js
app.use(require('less-middleware')(path.join(__dirname, 'less'),{ debug: true, dest: path.join(__dirname,'public'), once: true}));
app.use(express.static(path.join(__dirname, 'public')));
```
De este modo, cada vez que se inicie el servidor se compilarán todos los archivos .less dentro del directorio (y subdirectorios) `less/`. La opción __debug__ es útil para ver de dónde se están intentando coger los archivos less, y dónde se intentan generar los archivos css en el caso de que estemos teniendo problemas para generarlos.
**Importante:** El paquete less middleware va a generar los archivos `.css` en la carpeta __dest__  con la misma estructura de directorios que tengamos en la carpeta __source__. Por lo  tanto dentro de la carpeta __source__ tendremos que generar esa estructura de directorios tal y como queremos que esté en la carpeta `public`. Por ejemplo, si desde nuestro archivo html queremos incluir un archivo css del siguiente modo: `<link rel="stylesheet" href="stylesheets/estilos.css" />` tendremos que crear el archivo `less/stylesheets/estilos.less` que al ser procesado por less-middleware generará el archivo `public/stylesheets/estilos.css`. 

La otra forma de hacerlo es menos limpia pero nos evitamos usar esa dependencia
```sh
npm install -D less
```
En el archivo `app.js` añadir la siguiente línea antes de la línea para los archivos estáticos:
```js
...
var less = require('less');
var fs = require('fs');
function walk(currentDirPath, callback) {
  fs.readdir(currentDirPath, function (err, files) {
      if (err) {
          throw new Error(err);
      }
      files.forEach(function (name) {
          var filePath = path.join(currentDirPath, name);
          var stat = fs.statSync(filePath);
          if (stat.isFile()) {
              callback(filePath, stat);
          } else if (stat.isDirectory()) {
              walk(filePath, callback);
          }
      });
  });
}


walk(path.join(__dirname, 'public/'), function(filePath, stat) {
  if(path.extname(filePath) == '.less'){
    fs.readFile(filePath, function(err,file){
      less.render(file.toString(), function(er,css) { 
        fs.writeFile(filePath.replace(/\.less$/,'.css'), css.css, function(e) {
            if(e) return console.error(e);
        })
      })
    });
  }
});
...
```