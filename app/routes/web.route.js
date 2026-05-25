'use strict'

const Routes = require('@refkinscallv/express-routing')

Routes.get('/', ({ res }) => {
    res.render('welcome', {
        version: '3.0.2'
    })
})
