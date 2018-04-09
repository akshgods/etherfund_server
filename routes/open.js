const route = require('express');
const router = new route.Router();
const Item = require("../models").Item;


router.get("/data", (req, res) => {
  return res.json({
      success: true,
      message: 'You can see the data now!'
  });
})

router.get("/item", (req, res) => {
  Item.findAndCountAll()
  .then(data => {
    return res.status(200).json(data)
  })
  .catch(err => console.log(err))
});

module.exports = router;
