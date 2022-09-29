const express = require('express');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const File = require('./models/file');

//instancia de express
const app = express();

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/images'
}));






//PASO 2 POST method route -----------------------------------------------
//Especificamos la dirección par recibir los datos del cliente ('/api/save')
//request: datos recibidos del cliente
//response: respuesta que enviamos al cliente

app.post('/api/save', (request, response) => {

    console.log('respuesta recibida');
    const data = request.body;
    console.log(data);

    var file = new File();

    //Asignamos los valores:
    file.description = data.description;
    file.image = data.image;

    file.save((err, fileStored) => {

        if (err || !fileStored) {
            return response.status(404).send({
                status: 'error',
                message: 'El post no se ha guardado !!!'
            });
        }

        // Devolver una respuesta 
        return response.status(200).send({
            status: 'success',
            fileStored
        });

    });

});

//Subida de imágenes -------------------------------------------------------------

app.post('/api/saveImage', (req, res) => {
    const file = req.files.myFile;
    const fileName = req.files.myFile.name;
    const path = __dirname + '/public/images/' + fileName;
    console.log(path);

    file.mv(path, (error) => {
        if (error) {
            console.error(error);
            res.writeHead(500, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({ status: 'error', message: error }));
            return;
        }
        return res.status(200).send({ status: 'success', path: 'public/images/' + fileName });
    });



});


//// -----CONSULTA A LA BDD------------------------------------------------

//GET method route
//recibimos la consulta desde el cliente y devolvemos los datos:
app.get('/api/files', (request, response) => {

    var query = File.find({});

    query.sort('-date').exec((err, files) => {

        if (err) {
            return response.status(500).send({
                status: "error",
                message: "Error al extraer los datos"
            });
        }

        //Si no existen artículos:
        if (!files) {
            return response.status(404).send({
                status: "error",
                message: "No hay posts para mostrar"
            });
        }

        return response.status(200).send({
            status: "success",
            files
        });

    });




});
