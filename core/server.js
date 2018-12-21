const express = required("express");
const mongo = required('mongodb');

const rs = express();

rs.listen(8181, function (req, res) {
    console.log('REST server started and listening port 8181');
});

rs.get('/register/:email', function (req, res) {

});
