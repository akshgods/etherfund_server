const route = require('express');
const router = new route.Router();
const control = require("../controllers/controller");

router.get("/data", (req, res) => {
  return res.json({
      success: true,
      message: 'You can see the data now!'
  });
})

router.get("/item", control.getAllCampaign);

module.exports = router;
