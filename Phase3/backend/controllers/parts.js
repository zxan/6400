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

  if (status) {
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
