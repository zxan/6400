//include authentication like log in here
const con = require('../connect');

exports.getPassword = (req, res) => {
    const username = req.query.username; // or req.body.username, depending on your setup
    console.log(req.query)
    const query = 'SELECT u.password FROM User u WHERE u.username = ?';
    con.query(query, username, (err, result) => {
        if (err) {
            res.status(500).send('Error in database');
            return;
        }
        console.log(result);
        if (result.length === 0) {
            res.json('');
        } else {
            // Example: Returning only the password, but consider the security implications
            const { password } = result[0];
            res.json({ password });
        }
    });
};

exports.isManagerOrOwner = (req, res) => {
    const username = req.query.username; // or req.body.username, depending on your setup
    const query = `
    SELECT CASE 
        WHEN EXISTS (SELECT 1 FROM Manager WHERE username = ?) THEN 1
        WHEN EXISTS (SELECT 1 FROM Owner WHERE username = ?) THEN 1 ELSE 0 END AS isManagerOrOwner;
`;
    con.query(query, [username,username], (err, result) => {
        if (err) {
            res.status(500).send('Error in database');
            return;
        }
        if (result[0].isManagerOrOwner === 0) {

            res.json(false);
        } else {
           console.log(result[0]);
            // Example: Returning only the password, but consider the security implications
            res.json(true);
        }
    });
};

exports.isInventoryOrOwner = (req, res) => {
    const username = req.query.username; // or req.body.username, depending on your setup
    const query = `
    SELECT CASE 
        WHEN EXISTS (SELECT 1 FROM InventoryClerk WHERE username = ?) THEN 1
        WHEN EXISTS (SELECT 1 FROM Owner WHERE username = ?) THEN 1 ELSE 0 END AS isInventoryOrOwner;
`;
    con.query(query, [username,username], (err, result) => {
        if (err) {
            res.status(500).send('Error in database');
            return;
        }
        if (result[0].isInventoryOrOwner === 0) {

            res.json(false);
        } else {
           console.log(result[0]);
            // Example: Returning only the password, but consider the security implications
            res.json(true);
        }
    });
};