var express = require("express");
var router = express.Router();

router.use("/", require("./ops/crudOps"));

module.exports = router;