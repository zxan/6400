const con = require('../connect');

exports.getPartOrder = (req, res) => {
  const {
    orderNumber,
    vendorName,
    vin,
    partNumber,
    quantity,
    cost,
    status,
  } = req.query;

  const conditions = [];
  const params = [];

  if (status && Array.isArray(status)) {
    // Use IN clause to match multiple statuses
    conditions.push('p.status IN (?)');
    params.push(status);
  } else if (status) {
    // Use = for a single status
    conditions.push('p.status = ?');
    params.push(status);
  }

  // if (orderNumber) {
  //   conditions.push('po.orderNumber LIKE ?');
  //   params.push(`%${orderNumber}%`);
  // }

  // if (vendorName) {
  //   conditions.push('po.vendorName LIKE ?');
  //   params.push(`%${vendorName}%`);
  // }

  if (vin) {
    conditions.push('po.vin =?');
    params.push(vin);
  }

  // if (partNumber) {
  //   conditions.push('p.partNumber LIKE ?');
  //   params.push(`%${partNumber}%`);
  // }

  // if (quantity) {
  //   conditions.push('p.quantity = ?');
  //   params.push(quantity);
  // }

  // if (cost) {
  //   conditions.push('p.cost = ?');
  //   params.push(cost);
  // }

  const searchQuery = `
    SELECT
      po.orderNumber, po.vendorName, po.vin, p.partNumber, p.quantity, p.cost, p.status
    FROM PartOrder po
    JOIN Part p ON po.orderNumber = p.orderNumber AND p.vin=po.vin
    WHERE ${conditions.join(' AND ')};
  `;

  con.query(searchQuery, params, (err, results) => {
    if (err) {
      console.error('Error fetching part orders:', err);
      res.status(500).send('Error with the database');
      return;
    }

    const partOrderData = results;
    res.json(partOrderData);
  });
};


exports.updatePartOrderStatus = (req, res) => {
  const { orderNumber, partNumber, vin } = req.params;
  const { status } = req.body;

  // Check the current status
  const checkStatusQuery = `
    SELECT p.status FROM Part p
    WHERE p.orderNumber = ? AND p.partNumber = ? AND p.vin = ?;
  `;

  con.query(checkStatusQuery, [orderNumber, partNumber, vin], (checkStatusErr, checkStatusResults) => {
    if (checkStatusErr) {
      console.error('Error checking part order status:', checkStatusErr);
      res.status(500).send('Error with the database');
      return;
    }

    const currentStatus = checkStatusResults[0].status;

    // Conditions for Update
    let update = false;
    let message = '';

    if (currentStatus === 'ordered' && status === 'ordered') {
      message = 'It is already ordered';
    } else if (currentStatus === 'received' && (status === 'ordered' || status === 'received')) {
      message = 'Status cannot be reverted.';
    } else if (currentStatus === 'installed') {
      message = 'Status cannot be changed.';
    } else {
      update = true;
    }

    // Update Status
    if (update) {
      const updateStatusQuery = `
        UPDATE Part p
        SET p.status = ?
        WHERE p.orderNumber = ? AND p.partNumber = ? AND p.vin = ?;
      `;

      con.query(updateStatusQuery, [status, orderNumber, partNumber, vin], (updateErr, updateResults) => {
        if (updateErr) {
          console.error('Error updating part order status:', updateErr);
          res.status(500).send('Error with the database');
          return;
        }

        res.json({ success: true, message: 'Order status updated successfully' });
      });
    } else {
      // Return the appropriate message if no update is performed
      res.json({ success: false, message });
    }
  });
};

exports.countPartOrdersByVin = (req, res) => {
  const vin = req.query.vin;

  if (vin === undefined) {
    res.status(400).send('VIN is undefined');
    return;
  }

  const countQuery = `
    SELECT COUNT(*) AS partOrdersCount
    FROM PartOrder
    WHERE vin = ?;
  `;

  con.query(countQuery, [vin], (countErr, countResults) => {
    if (countErr) {
      console.error('Error counting part orders:', countErr);
      res.status(500).send('Error with the database');
      return;
    }

    const partOrdersCount = countResults[0].partOrdersCount;
    res.json({ partOrdersCount });
  });
};


exports.getPartOrderNumbersByVin = (req, res) => {
  const vin = req.query.vin;

  if (vin === undefined) {
    res.status(400).send('VIN is undefined');
    return;
  }

  const query = `
    SELECT orderNumber
    FROM PartOrder
    WHERE vin = ?;
  `;

  con.query(query, [vin], (err, results) => {
    if (err) {
      console.error('Error fetching part order numbers:', err);
      res.status(500).send('Error with the database');
      return;
    }

    const partOrderNumbers = results.map((result) => vin + '-' + result.orderNumber);
    res.json({ partOrderNumbers });
  });
};
exports.addPartsOrder = (req, res) => {
  const {
    partNumber,
    quantity,
    description,
    cost,
    vin,
    storedUser,
    orderNumber,
    vendorInfo: { name: vendorName },
  } = req.body;

  console.log('Stored User:', storedUser);
  console.log('orderNumber for add part:', orderNumber);

  // Generate PurchaseOrderNumber
  const username = storedUser;




    // Insert into PartOrder table
    const partOrderQuery = `
      INSERT INTO PartOrder (vin, orderNumber, username, vendorName)
      VALUES ('${vin}', '${orderNumber}', '${username}', '${vendorName}')
    `;

    con.query(partOrderQuery, (partOrderError) => {
      if (partOrderError) {
        console.error('Error adding to PartOrder table:', partOrderError);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Insert into Part table
      const partQuery = `
        INSERT INTO Part (partNumber, vin, orderNumber, quantity, status, description, cost)
        VALUES ('${partNumber}', '${vin}', '${orderNumber}', '${quantity}', 'ordered', '${description}', '${cost}')
      `;

      con.query(partQuery, (partError) => {
        if (partError) {
          console.error('Error adding to Part table:', partError);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json({ message: 'Parts order added successfully' });
      });
    });
};

// Update an existing part order
exports.updatePartsOrderwithParts = (req, res) => {
  let {
    vin,
    partNumber,
    quantity,
    description,
    cost,
    orderNumber,
    vendorInfo: { name: vendorName },
  } = req.body;
  orderNumber = orderNumber.slice(-3);
  console.log('Received data for update:', req.body);
  
  console.log('orderNumber for update part:', orderNumber);

  // insert a new row into the Part table only if the combination of vin, orderNumber, and partNumber doesn't already exist.
  const updatePartQuery = `
  INSERT INTO Part (partNumber, vin, orderNumber, quantity, status, description, cost)
  SELECT
    '${partNumber}' AS partNumber,
    '${vin}' AS vin,
    '${orderNumber}' AS orderNumber,
    '${quantity}' AS quantity,
    'ordered' AS status,
    '${description}' AS description,
    '${cost}' AS cost
  FROM dual
  WHERE NOT EXISTS (
    SELECT 1
    FROM Part
    WHERE vin = '${vin}'
      AND orderNumber = '${orderNumber}'
      AND partNumber = '${partNumber}'
  );
  
  `;

  con.query(updatePartQuery, (error, results) => {
    if (error) {
      console.error('Error updating Part table:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Optionally, you can update other related tables if needed

    res.json({ message: 'Part order updated successfully' });
  });
};
