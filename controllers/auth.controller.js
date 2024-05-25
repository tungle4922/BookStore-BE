const express = require("express"),
  router = express.Router();

const service = require("../services/auth.service");

router.post("/signup", async (req, res) => {
  await service.AddAUser(req.body);
  res.status(201).send("Created successfully.");
});

router.post("/login", async (req, res) => {
  const result = await service.Login(req.body);
  res.status(201).send(result);
});

module.exports = router;
