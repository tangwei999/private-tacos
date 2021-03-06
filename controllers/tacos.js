var express = require('express')
var db = require('./../models')
var router = express.Router()

function isUsersTaco (req, taco) {
  if (req.user.id !== taco.userId) {
    req.flash('error', 'You cannot do that')
    res.redirect('/tacos')
    return false
  }
  return true
}

router.get('/', function (req, res) {
  if (req.query.filter) {
    req.user.getTacos().then(function (tacos) {
      res.render('tacos/index', {tacos: tacos, title: 'My Tacos'})
    }).catch(function (err) {
      res.status(500).render('error')
    })
  } else {
    db.taco.findAll().then(function (tacos) {
      res.render('tacos/index', {tacos: tacos, title: 'All Tacos'})
    }).catch(function (err) {
      res.status(500).render('error')
    })
  }
})

router.get('/new', function (req, res) {
  res.render('tacos/new')
})

router.get('/:id/edit', function (req, res) {
  db.taco.findById(req.params.id).then(function (taco) {
    if (taco) {
      if (!isUsersTaco(req,taco)) return
      res.render('tacos/edit', {taco: taco})
    } else {
      res.status(404).render('error')
    }
  }).catch(function (err) {
    res.status(500).render('error')
  })
})

router.get('/:id', function (req, res) {
  db.taco.findById(req.params.id).then(function (taco) {
    if (taco) {
      res.render('tacos/show', {taco: taco})
    } else {
      res.status(404).render('error')
    }
  }).catch(function (err) {
    res.status(500).render('error')
  })
})

router.put('/:id', function (req, res) {
  db.taco.findById(req.params.id).then(function (taco) {
    if (taco) {
      if (!isUsersTaco(req,taco)) return
      taco.updateAttributes(req.body).then(function () {
        res.send({msg: 'success'})
      })
    } else {
      res.status(404).send({msg: 'error'})
    }
  }).catch(function (err) {
    res.status(500).send({msg: 'error'})
  })
})

router.delete('/:id', function (req, res) {
  db.taco.findById(req.params.id).then(function (taco) {
    if (taco) {
      if (!isUsersTaco(req,taco)) return
      taco.destroy().then(function () {
        res.send({msg: 'success'})
      })
    } else {
      res.status(404).send({msg: 'error'})
    }
  }).catch(function (err) {
    res.status(500).send({msg: 'error'})
  })
})

router.post('/', function (req, res) {
  req.user.createTaco(req.body).then(function (taco) {
    res.redirect('/tacos')
  }).catch(function (err) {
    res.status(500).render('error')
  })
})

module.exports = router
