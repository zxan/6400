const con = require('../connect');

// Function to add an individual customer
const addIndividualCustomer = (req, res) => {
  const {
    firstName,
    lastName,
    driverLicense,
    email,
    phoneNumber,
    street,
    city,
    state,
    postalCode,
    // Add more individual customer fields as needed
  } = req.body;

  // Perform an SQL INSERT operation to add the individual customer to the database
  const customerSQL = `
    INSERT INTO Customer (email, phoneNumber, street, city, state, postalCode)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  con.query(
    customerSQL,
    [email, phoneNumber, street, city, state, postalCode],
    (err, result) => {
      if (err) {
        console.error('Error adding customer:', err);
        res.status(500).send('Error adding customer');
      } else {
        console.log('Customer added successfully');
        res.status(200).send('Customer added successfully');
      }

      const individualSQL = `
      INSERT INTO Individual (driverLicense, firstName, lastName, customerID)
      VALUES (?, ?, ?, (SELECT customerID FROM Customer WHERE email = ? AND  phoneNumber = ? AND street = ? AND  city = ? AND  state = ? AND  postalCode = ?));
    `;
    con.query(individualSQL,
        [driverLicense, firstName,lastName,email, phoneNumber, street, city, state, postalCode],
        (err, result) => {
            if (err) {
                console.error('Error adding individual customer:', err);
                res.status(501).send('Error adding individual customer');
              } else {
                console.log('Individual customer added successfully');
                res.status(200).send('Individual customer added successfully');
              }
            }
        );
    


    }
  );

  

};

// Function to add a business customer
const addBusinessCustomer = (req, res) => {
  const {
    taxID,
    businessName,
    name,
    title,
    email,
    phoneNumber,
    street,
    city,
    state,
    postalCode,
    // Add more business customer fields as needed
  } = req.body;

  // Perform an SQL INSERT operation to add the business customer to the database
  const sql = `
    INSERT INTO business_customers (tax_id, business_name, contact_name, contact_title, email, phone_number, street, city, state, postal_code)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  con.query(
    sql,
    [taxID, businessName, name, title, email, phoneNumber, street, city, state, postalCode],
    (err, result) => {
      if (err) {
        console.error('Error adding business customer:', err);
        res.status(500).send('Error adding business customer');
      } else {
        console.log('Business customer added successfully');
        res.status(200).send('Business customer added successfully');
      }
    }
  );
};

module.exports = { addIndividualCustomer, addBusinessCustomer };