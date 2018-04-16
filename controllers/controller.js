const Item = require("../models").Item;
const Web3 = require("web3");
const EtherFund = require("../contracts/EtherFund.json");
const web3 = new Web3(Web3.givenProvider || 'https://open-private.herokuapp.com/');

module.exports = {
  getAllCampaign: (req, res) => {
    Item.findAndCountAll({order: [['createdAt', 'DESC']]})
      .then(data => {
        return res.status(200).json(data);
      })
      .catch(err => console.log(err));
  },

  postNewCampaign: (req, res) => {
    Item.create({
      ...req.body
    }).then(function(newData) {
      return res.json({
        success: true,
        message: "New Campaign is posted",
        campaignId: newData.get().id
      });
    });
  },

  updateCampaignContract: (req, res) => {
    Item.update(
      { contractAddress: req.body.contractAddress },
      { where: { id: req.params.id } }
    )
      .then(data => {
        return res.status(200).json(data);
      })
      .catch(err => res.status(400).send(err));
  },

  updateCampaignFundingInfo: (req, res) => {
    console.log(req.body.contractAddress);
    const etherFundContract = new web3.eth.Contract(EtherFund.abi);
    etherFundContract.options.address = req.body.contractAddress;
    etherFundContract.methods.totalRaised().call()
      .then(result => {
        const updatedTotal = web3.utils.fromWei(result, "ether");
        Item.update(
          { raised : updatedTotal },
          { where: { id: req.params.id } }
        )
          .then(data => {
            return res.status(200).json(data);
          })
          .catch(err => res.status(400).send(err));
      })
    //etherFundContract.getBackerCount.call()
      //.then(res => console.log(res))
  }
};
