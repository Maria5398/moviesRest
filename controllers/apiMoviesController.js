const db = require('../database/models');

const getUrl = (req) => req.protocol + '://' + req.get('host') + req.originalUrl;


module.exports = {
    getAll : (req,res) => {
        db.Pelicula.findAll()
        .then(peliculas => {
            peliculas.forEach(pelicula =>{
                pelicula.setDataValue('link', getUrl(req) + '/' + pelicula.id)
            });
            let response = {
                meta : {
                    status : 200,
                    cantidad : peliculas.length,
                    link : getUrl(req)
                },
                data : peliculas
            }
            return res.status(200).json(response)
        })
        .catch(error => res.status(500).json({
            error
        }))
    },
    getById : (req,res) => {
        if(req.params.id % 1 !== 0){               
            return res.status(400).json({
                status: 400,
                msg: 'ruta no reconocida'
            }) 
        }
        db.Pelicula.findByPk(req.params.id)
        .then(pelicula =>{
            if(pelicula){
                return res.status(200).json({
                    meta: {
                        status: 200,
                        link: getUrl(req),
                        listado : req.protocol + '://' + req.get('host') + '/api/movies'    //url api
                    },
                    data: pelicula
                })
            }else{
                return res.status(400),json({
                    status: 400,
                    msg: 'ruta no reconocida'
                })
            } 
        })
        .catch(error=> res.status(500).json({
            error
        }))
    },
    create : (req,res)=>{
        const {title,awards,rating, release_date, length} = req.body;
        db.Pelicula.create({
            title,
            awards,
            rating, 
            release_date,
            length
        })
        .then(result =>{
            console.log(result)
            res.send(result)
        })
        .catch(error =>{
            console.log(error)
            switch (error.name) {
                case "SequelizeValidationError":
                    let erroresMsg = [];
                    let erroresNotNull = [];
                    let erroresValidation = [];
                    error.errors.forEach(error => {
                        erroresMsg.push(error.message)
                        if (error.type == "notNull Violation") {
                            erroresNotNull.push(error.message)
                        }
                        if (error.type == "Validation error") {
                            erroresValidation.push(error.message)
                        }
                    });
                    let response = {
                        status: 400,
                        messages: "datos faltantes o erróneos",
                        errores: {
                            cantidad: erroresMsg.length,
                            msg: erroresMsg,
                            notNull: erroresNotNull,
                            validation: erroresValidation
                        }
                    }
                    return res.status(400).json(error)
                    default:
                        return res.status(500).json({error})
                }
        })

    }

}