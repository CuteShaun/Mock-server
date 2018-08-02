const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

/* GET users listing. */
router.all('/*', (req, res, next) => {

    const filePath = path.join(__dirname, 'api', req.path, req.method.toLowerCase() + '.json');

    fs.stat(filePath, function (err) {
        if (err) {
            return res.status(404).json({ "error": 404 });
        }

        fs.createReadStream(filePath).pipe(res);
    });

});

module.exports = router;


