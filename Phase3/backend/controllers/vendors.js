const con = require('../connect');

exports.getSearchVendors = (req, res) => {
  // Retrieve the search string from the query parameters or request body
  const searchstring = req.query.searchstring || req.body.searchstring;

  // Ensure the searchstring is not empty
  if (!searchstring) {
    res.status(400).send('Search string is required');
    return;
  }

  // SQL query to search for vendors based on the searchstring
  const searchQuery = `
    SELECT name, phoneNumber, street, city, state, postalCode
    FROM Vendor
    WHERE
        name LIKE CONCAT('%', ?, '%')
        OR phoneNumber LIKE CONCAT('%', ?, '%')
        OR street LIKE CONCAT('%', ?, '%')
        OR city LIKE CONCAT('%', ?, '%')
        OR state LIKE CONCAT('%', ?, '%')
        OR postalCode LIKE CONCAT('%', ?, '%');
  `;

  con.query(searchQuery, [searchstring, searchstring, searchstring, searchstring, searchstring, searchstring], (err, results) => {
    if (err) {
      console.error('Error fetching vendors:', err);
      res.status(500).send('Error with the database');
      return;
    }

    // Extract vendor data from the results
    const vendorData = results;

    res.json(vendorData);
  });
};

exports.addVendor = (req, res) => {
  const { name, phoneNumber, street, city, state, postalCode } = req.body;
  console.log('Request body:', req.body);
  if (!name || !phoneNumber || !street || !city || !state || !postalCode) {
    res.status(400).send('All fields are required');
    return;
  }

  const insertQuery = `
    INSERT INTO Vendor (name, phoneNumber, street, city, state, postalCode)
    SELECT ?, ?, ?, ?, ?, ?
    FROM dual
    WHERE NOT EXISTS (
        SELECT 1
        FROM Vendor
        WHERE name = ?
    );
  `;

  con.query(
    insertQuery,
    [name, phoneNumber, street, city, state, postalCode, name],
    (err, results) => {
      if (err) {
        console.error('Error adding a vendor:', err);
        res.status(500).send('Error with the database');
        return;
      }

      const message =
        results.affectedRows > 0
          ? 'Vendor added successfully'
          : 'Vendor already exists and cannot be added';

      res.json({ message });
    }
  );
};
