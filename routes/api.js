const route = require('express');
const router = new route.Router();
const control = require("../controllers/controller")

router.get("/data", (req, res) => {
  return res.json({
      success: true,
      message: 'You can see the data now!'
  });
})

router.post("/item", control.postNewCampaign);

router.put("/item/:id", control.updateCampaignContract);

router.put("/item/fund/:id", control.updateCampaignFundingInfo);

module.exports = router;
