var tasks = require('../models').Tasks
var Op = require('Sequelize').Op
var sequelize = require('sequelize')

module.exports = {
  findTaskById: function (req, res) {
    tasks.findById(req.body.id).then(data => {
      if (data.length === 0) {
        res.status(404).send('No data found')
      } else {
        res.status(200).json(data)
      }
    }).catch(error => {
      console.log(error)
    })
  },

  loadTasksCount: function (id) {
    return new Promise((resolve, reject) => {
      tasks.count({
        where: {
          'AssignedTo_Id': id,
          status: {
            [Op.ne]: 'completed'
          }
        }
      }).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getInbox: function (req, res) {
    tasks.findAndCountAll({
      where: {
        AssignedTo_Id: req.params.id,
        status: {
          [Op.ne]: 'completed'
        }
      },
      order: [['createdAt', 'DESC']]
    }).then(data => {
      if (data.length === 0) {
        res.status(404).send('No data found')
      } else {
        console.log(data.count)
        console.log(data.rows)
        res.status(200).json(data)
      }
    }).catch(error => {
      console.log(error)
    })
  },

  filterTasks: function (req, res) {
    tasks.findAndCountAll({
      where: {
        AssignedTo_Id: req.query.userId || {
            [Op.ne]: null
        },
        status: req.query.status || {
            [Op.ne]: null
        },
        projectId: req.query.projectId || {
            [Op.ne]: null
        }
      },
      offset: (req.query.page - 1) * 10,
      limit: 10,
      order: [['createdAt', 'DESC']]
    }).then(data => {
      if (data.length === 0) {
        res.status(404).send('No data found')
      } else {
        res.status(200).json(data)
      }
    }).catch(error => {
      console.log(error)
    })
  },

  addTask: function (req, res) {
    console.log(req.body)
    tasks.create(req.body).then(() => {
      res.status(200).send('task added')
    }).catch(error => {
      console.log(error)
    })
  },

  updateTask: function (req, res) {
    console.log(req.body)
    tasks.update(req.body,
      {
        where: {
          id: req.body.id
        }
      }).then((data) => {
      if (data[0] === 0) {
        res.status(404).send('No affected data')
      } else {
        res.status(200).send('task updated')
      }
    }).catch(error => {
      console.log(error)
    })
  },

  getCountByProject: function (req, res) {
    tasks.findAll({
      group: ['projectId'],
      attributes: [['projectId', 'name'], [sequelize.fn('COUNT', 'projectId'), 'value']]
    }).then(data => {
      if (data.length === 0) {
        res.status(404).send('No data found')
      } else {
        res.status(200).json(data)
      }
    }).catch(error => {
      console.log(error)
    })
  },

  getCountByStatus: function (req, res) {
    tasks.findAll({
      group: ['status'],
      attributes: [['status', 'name'], [sequelize.fn('COUNT', 'status'), 'value']]
    }).then(data => {
      if (data.length === 0) {
        res.status(404).send('No data found')
      } else {
        res.status(200).json(data)
      }
    }).catch(error => {
      console.log(error)
    })
  },

  getCountByCreator: function (req, res) {
    tasks.findAll({
      raw: true,
      group: ['createdBy_id'],
      attributes: [['createdBy_id', 'name'], [sequelize.fn('COUNT', 'createdBy_id'), 'value']]
    }).then(data => {
      if (data.length === 0) {
        res.status(404).send('No data found')
      } else {
        var name = data.map(x => x.name)
        var value = data.map(x => x.value)
        res.status(200).json([name, value])
      }
    }).catch(error => {
      console.log(error)
    })
  },

  getCountByDue: function (req, res) {
    tasks.findAll({
      raw: true,
      where: {
        due_date: {
          [Op.gt]: new Date()
        }
      },
      limit: 5,
      order: [['due_date', 'ASC']],
      group: ['due_date'],
      attributes: [['due_date', 'name'], [sequelize.fn('COUNT', 'due_date'), 'value']]
    }).then(data => {
      if (data.length === 0) {
        res.status(404).send('No data found')
      } else {
        var name = data.map(x => x.name)
        var value = data.map(x => x.value)
        res.status(200).json([name, value])
      }
    }).catch(error => {
      console.log(error)
    })
  }
}
