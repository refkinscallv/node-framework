'use strict'

const Routes = require('@refkinscallv/express-routing')

Routes.get('/', ({ res }) => {
    res.send('Hello World')
})
