const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const db = require("../models");
const Op = db.Sequelize.Op;
const Apikeys = db.Apikeys;

const ApiKeyValidator = (req, res, next) => {
  const data = ({ api_key, usuario } = req.body);

  if (req.body) {
    Apikeys.findAll({
      where: {
        status: {
          [Op.eq]: 1,
        },
        api_key: {
          [Op.eq]: api_key,
        },
        usuario: {
          [Op.eq]: usuario,
        },
      },
    })
      .then((data) => {
        if (data.length > 0) {
          next();
        } else {
          return res.status(401).json({ error: "Acceso no autorizado" });
        }
      })
      .catch((err) => {});
  } else {
    return res.status(401).json({ error: "Acceso no autorizado" });
  }
};

module.exports = ApiKeyValidator;
