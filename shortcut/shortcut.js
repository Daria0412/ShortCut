const nugu = require('./config.json')
const express = require('express')
const app = express()
app.use(express.json())

app.use('/shortcut/response', (req, res) => {
    const os = req.body.action.parameters['os'].value
    const program = req.body.action.parameters['program'].value
    const action = req.body.action.parameters['action'].value
    let output = nugu.response.output
    console.log(os, program, action)
    var ment = os + "의 " + program + " " + action + " 단축키는 "

    var mysql      = require('mysql');
    var connection = mysql.createConnection({
      host     : '3.21.207.223',
      user     : 'pitapet',
      password : 'mirim2',
      database : 'pitapet'
    });

    connection.connect(function(err) {
        if (err) {
    
            console.error('mysql connection error');
    
            console.error(err);
    
            throw err;
    
        }    
    });
    

    var sql = 'SELECT short FROM shortCut WHERE os = ? AND program = ? AND action = ?;'
    var params = [os, program, action]
    var rowdata
    var shortdata
    let shortcut

    connection.query(sql, params, function(err, rows, fields) {
        if (err) {
            console.log(err)
            throw err
        } else {
            rowdata = JSON.stringify(rows)
            console.log(rowdata)
            shortdata =  JSON.parse(rowdata)
            console.log(shortdata)
            shortcut = shortdata[0].short
            console.log(shortcut)
            output = {"prompt": ment + shortcut + " 입니다." }
            console.log(output)
            nugu.response.output = output
            return res.json(nugu.response)
        }
    })

    
})

app.listen(2025, (err, result) => {
    console.log("숏컷 서버 시작 : ", 2025)
})