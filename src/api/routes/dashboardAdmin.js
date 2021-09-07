const { isLoggedIn, isLoggedInAdmin } = require("../middlewares/helpers");
const db = require("../../database");
const { Router } = require("express");

//INITIALIZATION
const router = Router();

//ESTA ES LA RUTA DONDE VEO MIS SOLICITUDES
router.get("/myrequests", isLoggedIn, isLoggedInAdmin, async (req, res) => {
  const query =
    "SELECT s.id, s.codigo, e.titulo, DATE_FORMAT(s.fecha_envio, '%d/%m/%Y') FROM solicitudes AS s JOIN eventos AS e ON s.id_evento = e.id JOIN tipos_estado AS tes ON tes.id = s.estado WHERE tes.id = 2 GROUP BY fecha_envio";

  const rows = await db.query(query);

  if (rows.length > 0) {
    res.status(200).json({ data: rows });
  } else {
    res.status(400).json({ message: "Not found requests" });
  }
});

//ESTA RUTA MUESTRA LOS DETALLES DE LA SOLICITUD SELECCIONADA
router.get(
  "/myrequests/details/:id",
  isLoggedIn,
  isLoggedInAdmin,
  async (req, res) => {
    const { id } = req.params;

    const query =
      "SELECT s.codigo, DATE_FORMAT(s.fecha_envio,'%d/%m/%y') AS fecha_envio, e.titulo, tco.descripcion AS tipo_coordinador, e.nombre_coordinador, DATE_FORMAT(e.hora_inicio, '%h %p') AS hora_inicio, DATE_FORMAT(e.fecha_inicio,'%d/%m/%y') AS fecha_inicio, DATE_FORMAT(e.fecha_fin,'%d/%m/%y') AS fecha_fin, te.descripcion AS tipo_evento, e.descripcion, ti.descripcion AS tipo_inscripcion, tc.descripcion AS tipo_certificado, ta.descripcion AS tipo_ambiente, e.participantes, e.duracion, e.logo, e.img1, e.img2, e.img3 FROM eventos AS e JOIN solicitudes AS s ON e.id = s.id_evento JOIN tipos_coordinador AS tco ON tco.id = e.tipo_coordinador JOIN tipos_evento AS te ON te.id = e.tipo_evento JOIN tipos_inscripcion AS ti ON ti.id = e.tipo_inscripcion JOIN tipos_certificado AS tc ON tc.id = e.tipo_certificado JOIN tipos_ambiente AS ta ON ta.id = e.tipo_ambiente WHERE s.id = ?";

    const rows = await db.query(query, [id]);

    if (rows.length > 0) {
      res.status(200).json({ data: rows });
    } else {
      res.status(400).json({ message: "Not found requests" });
    }
  }
);

//SI LA SOLICITUD ES ACEPTADA
router.put(
  "/myrequests/details/approved/:id",
  isLoggedIn,
  isLoggedInAdmin,
  async (req, res) => {
    const { id } = req.params;

    const { observaciones } = req.body;

    const query =
      "UPDATE solicitudes SET estado = 1, observaciones = ? WHERE solicitudes.id = ?";

    await db.query(query, [observaciones, id]);

    res.status(200).json({ message: "Request and Event Updated" });
  }
);

//SI LA SOLICITUD ES RECHAZADA
router.put(
  "/myrequests/details/dismissed/:id",
  isLoggedIn,
  isLoggedInAdmin,
  async (req, res) => {
    const { id } = req.params;

    const { observaciones } = req.body;

    const query =
      "UPDATE solicitudes SET estado = 0, observaciones = ? WHERE solicitudes.id = ?";

    await db.query(query, [observaciones, id]);

    res.status(200).json({ message: "Request and Event Updated" });
  }
);

//EXPORTING ADMIN DASHBOARD ROUTES
module.exports = router;
