const route = require('express');
const router = new route.Router();

router.get("/data", (req, res) => {
  return res.json({
      success: true,
      message: 'You can see the data now!'
  });
})

module.exports = router;
