# Markdown Links

***
## 1. Resumen de la librería

En este proyecto see creo una librería para hacer mas facil la identificacion de links que se encunetra en los archivos .md 
donde nos mostrara cuantos link se encuentran en las carpetas iteradas si estan funcionales, si son unicos y si estan rotas 
esta libreria te dara la estadistica.


## md-links
extrae los links de las carpetas .md
## Instalar librería

npm install @leidytapias/md-links si estás usando Linux y esto falla trata anteponiendo sudo

## Como usar 

Ejemplos:

```sh
$ md-links ./some/example.md --validate
./some/example.md http://algo.com/2/3/ ok 200 Link a algo
./some/example.md https://otra-cosa.net/algun-doc.html fail 404 algún doc
./some/example.md http://google.com/ ok 301 Google
```

Vemos que el _output_ en este caso incluye la palabra `ok` o `fail` después de
la URL, así como el status de la respuesta recibida a la petición HTTP a dicha
URL.

##### `--stats`

Si pasamos la opción `--stats` el output (salida) será un texto con estadísticas
básicas sobre los links.

```sh
$ md-links ./some/example.md --stats
Total: 3
Unique: 3
```

También podemos combinar `--stats` y `--validate` para obtener estadísticas que
necesiten de los resultados de la validación.

```sh
$ md-links ./some/example.md --stats --validate
Total: 3
Unique: 3
Broken: 1
```

## Flujograma
  [Flujograma](https://lucid.app/lucidchart/bd8eaead-da12-48dd-bb2e-cfb86b3168d6/edit?invitationId=inv_00bda631-b67b-451a-aa4f-f8cf56f5647b&page=0_0#)
