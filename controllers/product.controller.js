const express = require("express"),
  router = express.Router();

const service = require("../services/product.service");

router.post("/", async (req, res) => {
  const data = await service.getAllBooks(req.body);
  res.send(data);
});

router.get("/:id", async (req, res) => {
  const data = await service.getBookById(req.params.id);
  if (data == undefined)
    res.status(404).json("Object not found with id : " + req.params.id);
  else res.send(data);
});

module.exports = router;
