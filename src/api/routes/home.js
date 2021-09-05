const db = require("../../database")
const { Router } = require("express")


//INITIALIZATION 
const router = Router()


//ESTA ES LA PÁGINA PRINCIPAL DONDE MUESTRA TODOS LOS EVENTOS
router.get("/", async (req, res) => {

    const query1 = "SELECT id, titulo, DATE_FORMAT(fecha_inicio, '%W, %d del %m') AS fecha_inicio, DATE_FORMAT(hora_inicio, '%h %p') AS hora_inicio, precio_inscripcion FROM eventos GROUP BY participantes DESC"

    const query2 = "SELECT id, titulo, DATE_FORMAT(fecha_inicio, '%W, %d del %m') AS fecha_inicio, DATE_FORMAT(hora_inicio, '%h %p') AS hora_inicio, precio_inscripcion FROM eventos WHERE fecha_inicio > NOW() GROUP BY fecha_inicio"

    const features = await db.query(query1)

    const closeOnes = await db.query(query2)

    if (features.length > 0 && closeOnes.length > 0) {

        res.status(200).json({featured_events: features, nearby_events: closeOnes})
    }
    else{
        res.status(400).json({message: "No found events"})
    }
})

//ESTA RUTA MUESTRA LOS DETALLES DEL EVENTO SELECCIONADO
router.get("/details/:id", async (req, res) => {

    const { id } = req.params

    const query = "SELECT e.logo AS logo_evento, e.titulo, tco.descripcion AS tipo_coordinador, e.nombre_coordinador, DATE_FORMAT(e.fecha_inicio, '%d/%m/%Y') AS fecha_inicio, DATE_FORMAT(e.hora_inicio, '%h:%m %p') AS hora_inicio, e.participantes, ti.descripcion AS tipo_inscripcion, e.precio_inscripcion, tc.descripcion AS tipo_certificado, e.precio_certificado, e.descripcion AS descripcion_evento, u.foto AS foto_coordinador, e.nombre_coordinador, e.img1, e.img2, e.img3 FROM eventos AS e JOIN usuarios AS u ON e.id_coordinador = u.id JOIN tipos_coordinador AS tco ON tco.id = e.tipo_coordinador JOIN tipos_inscripcion AS ti  ON ti.id = e.tipo_inscripcion JOIN tipos_certificado AS tc ON tc.id = e.tipo_certificado WHERE e.id = ?"

    const rows = await db.query(query, [id])

    if (rows.length > 0) {

        res.status(200).json({result: rows})
    }
    else{
        res.status(400).json({message: "Not found events"})
    }
})

//ESTA RUTA MUESTRA LOS EVENTOS SEGUN EL TITULO
router.get("/title/:titulo", async (req, res) => {

    const { titulo } = req.params

    const query = "SELECT id, titulo, DATE_FORMAT(fecha_inicio, '%W, %d del %m') AS fecha_inicio, DATE_FORMAT(hora_inicio, '%h %p') AS hora_inicio, precio_inscripcion FROM eventos WHERE titulo = ?"

    const rows = await db.query(query, [titulo])

    if (rows.length > 0) {

        res.status(200).json({result: rows})
    }
    else{
        res.status(400).json({message: "Not found events with this title"})
    }
})

//ESTA RUTA MUESTRA LOS EVENTOS SEGUN EL PRECIO
router.get("/prices/:precio1/:precio2", async (req, res) => {

    const { precio1, precio2 } = req.params

    const query = "SELECT id, titulo, DATE_FORMAT(fecha_inicio, '%W, %d del %m') AS fecha_inicio, DATE_FORMAT(hora_inicio, '%h %p') AS hora_inicio, precio_inscripcion FROM eventos WHERE precio_inscripcion BETWEEN ? AND ?"

    const rows = await db.query(query, [precio1, precio2])

    if (rows.length > 0) {

        res.status(200).json({result: rows})
    }
    else{
        res.status(400).json({message: "Not found events in this price range"})
    }
})

//ESTA RUTA MUESTRA LOS EVENTOS SEGUN LA CATEGORIA
router.get("/category/:categoria", async (req, res) => {

    const { categoria } = req.params

    const query = "SELECT e.id, e.titulo, DATE_FORMAT(e.fecha_inicio, '%W, %d del %m') AS fecha_inicio, DATE_FORMAT(e.hora_inicio, '%h %p') AS hora_inicio, e.precio_inscripcion FROM eventos AS e JOIN tipos_evento AS te ON e.tipo_evento = te.id WHERE te.id = ?"

    const rows = await db.query(query, [categoria])

    if (rows.length > 0) {

        res.status(200).json({result: rows})
    }
    else{
        res.status(400).json({message: "Not found events in this category"})
    }
})

//ESTA RUTA MUESTRA LOS EVENTOS SEGUN LA FECHA
router.get("/dates/:fecha1/:fecha2", async (req, res) => {

    const { fecha1, fecha2 } = req.params

    const query = "SELECT id, titulo, DATE_FORMAT(fecha_inicio, '%W, %d del %m') AS fecha_inicio, DATE_FORMAT(hora_inicio, '%h %p') AS hora_inicio, precio_inscripcion FROM eventos WHERE fecha_inicio BETWEEN cast(? AS date) AND cast(? as date) GROUP BY fecha_inicio"

    const rows = await db.query(query, [fecha1, fecha2])

    if (rows.length > 0) {

        res.status(200).json({result: rows})
    }
    else{
        res.status(400).json({message: "Not found events in this date range"})
    }
})

//EXPORTING HOME ROUTES
module.exports = router