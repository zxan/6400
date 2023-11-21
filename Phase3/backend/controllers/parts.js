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

  if (orderNumber) {
    conditions.push('po.orderNumber LIKE ?');
    params.push(`%${orderNumber}%`);
  }

  if (vendorName) {
    conditions.push('po.vendorName LIKE ?');
    params.push(`%${vendorName}%`);
  }

  if (vin) {
    conditions.push('po.vin LIKE ?');
    params.push(`%${vin}%`);
  }

  if (partNumber) {
    conditions.push('p.partNumber LIKE ?');
    params.push(`%${partNumber}%`);
  }

  if (quantity) {
    conditions.push('p.quantity = ?');
    params.push(quantity);
  }

  if (cost) {
    conditions.push('p.cost = ?');
    params.push(cost);
  }

  const searchQuery = `
    SELECT
      po.orderNumber, po.vendorName, po.vin, p.partNumber, p.quantity, p.cost, p.status
    FROM PartOrder po
    JOIN Part p ON po.orderNumber = p.orderNumber
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

    const partOrderNumbers = results.map((result) => result.orderNumber);
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
  console.log('orderNumber:', orderNumber);

  // Generate PurchaseOrderNumber
  const username = storedUser;
  const purchaseOrderNumberQuery = `
    SELECT CONCAT(SUBSTRING('${vin}', 4), '-', LPAD((SELECT COUNT(*) + 1 FROM PartOrder WHERE vin = '${vin}'), 2, '0')) AS PurchaseOrderNumber
  `;

  con.query(purchaseOrderNumberQuery, (error, results) => {
    if (error) {
      console.error('Error generating PurchaseOrderNumber:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const purchaseOrderNumber = results[0].PurchaseOrderNumber;

    // Insert into PartOrder table
    const partOrderQuery = `
      INSERT INTO PartOrder (vin, orderNumber, username, vendorName)
      VALUES ('${vin}', '${purchaseOrderNumber}', '${username}', '${vendorName}')
    `;

    con.query(partOrderQuery, (partOrderError) => {
      if (partOrderError) {
        console.error('Error adding to PartOrder table:', partOrderError);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Insert into Part table
      const partQuery = `
        INSERT INTO Part (partNumber, vin, orderNumber, quantity, status, description, cost)
        VALUES ('${partNumber}', '${vin}', '${purchaseOrderNumber}', '${quantity}', 'ordered', '${description}', '${cost}')
      `;

      con.query(partQuery, (partError) => {
        if (partError) {
          console.error('Error adding to Part table:', partError);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json({ message: 'Parts order added successfully' });
      });
    });
  });
};
