const con = require('../connect');
exports.getSearchVendors = (req, res) => {
  // Retrieve the search string from the query parameters or request body
  const searchstring = req.query.searchstring || req.body.searchstring;

  // Check if the searchstring is undefined or an empty string
  if (searchstring === undefined || searchstring === '') {
    // Provide a default behavior to return all vendors
    const defaultQuery = `
      SELECT name, phoneNumber, street, city, state, postalCode
      FROM Vendor;
    `;

    con.query(defaultQuery, (err, results) => {
      if (err) {
        console.error('Error fetching all vendors:', err);
        res.status(500).send('Error with the database');
        return;
      }

      // Extract vendor data from the results
      const vendorData = results;

      res.json(vendorData);
    });
    return;
  }

  // SQL query to search fosr vendors based on the searchstring
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
    res.status(400).json({ error: 'All fields are required' });
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
        res.status(500).json({ error: 'Error with the database' });
        return;
      }

      const message =
        results.affectedRows > 0
          ? 'Vendor added successfully'
          : 'Vendor already exists and cannot be added';

      // Send a consistent response format
      res.json({ message, vendor: results.affectedRows > 0 ? { name, phoneNumber, street, city, state, postalCode } : null });
    }
  );
};


// Endpoint to get vendor information by name
exports.getVendorByName = (req, res) => {
  const vendorName = req.query.name || req.body.name;

  if (!vendorName) {
    res.status(400).send('Vendor name is required');
    return;
  }

  // SQL query to get vendor information by name
  const getVendorQuery = `
    SELECT name, phoneNumber, street, city, state, postalCode
    FROM vendor
    WHERE name = ?;
  `;

  console.log('Query results:', results); // Log the results to the console
  const vendorData = results[0];


  con.query(getVendorQuery, [vendorName], (err, results) => {
    if (err) {
      console.error('Error fetching vendor information:', err);
      res.status(500).send('Error with the database');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('Vendor not found');
      return;
    }

    res.json(vendorData);
  });
};


exports.getVendorInfoByPartOrder = (req, res) => {
  let orderNumber = req.query.orderNumber || req.body.orderNumber;

  // Extract the last 3 characters from orderNumber
  orderNumber = orderNumber.slice(-3);

  if (!orderNumber) {
    res.status(400).send('Order number is required');
    return;
  }

  // SQL query to get vendor information by part order number
  const getVendorQuery = `
    SELECT v.name, v.phoneNumber, v.street, v.city, v.state, v.postalCode
    FROM Vendor v
    INNER JOIN PartOrder po ON v.name = po.vendorName
    WHERE po.orderNumber = ?;
  `;

  con.query(getVendorQuery, [orderNumber], (err, results) => {
    if (err) {
      console.error('Error fetching vendor information:', err);
      res.status(500).send('Error with the database');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('Vendor not found for the given part order');
      return;
    }

    const vendorData = results[0];
    res.json(vendorData);
  });
};