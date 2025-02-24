const con = require('../connect');

// Function to add an individual customer
const addIndividualCustomer = (req, res) => {
    //console.log(req.body);
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
            //res.status(200).send('Customer added successfully');
        }

        const individualSQL = `
        INSERT INTO Individual (driverLicense, firstName, lastName, customerID)
        VALUES (?, ?, ?, (SELECT customerID FROM Customer WHERE email = ? AND  phoneNumber = ? AND street = ? AND  city = ? AND  state = ? AND  postalCode = ?));
        `;
        con.query(individualSQL,
            [driverLicense, firstName,lastName,email, phoneNumber, street, city, state, postalCode],
            (err, result) => {
                if (err) 
                {
                    console.error('Error adding individual customer:', err);
                    res.status(500).send('Error adding individual customer');
                } 
                else 
                {
                    console.log('Individual customer added successfully');
                    //res.status(200).send('Individual customer added successfully');
                    //return res.json(result);
                    //res.status(200).send(result);
                }
                
                const selectQuery = `SELECT C.CustomerID, C.email, C.phoneNumber, C.street, C.city, C.state, C.postalCode, I.driverLicense, I.firstName, I.lastName 
                FROM Customer AS C JOIN Individual AS I ON C.customerID = I.customerID 
                WHERE I.driverLicense = ?;`;
                con.query(selectQuery, [driverLicense],(err,selectResult) => {
                    if (err){
                        console.error('Error selecting individual customer:', err);
                        res.status(500).send('Error selecting individual customer');
                    }
                    else {
                        console.log('Individual customer selected successfully');
                        //return res.json(result);
                        res.status(200).send(selectResult);
                    }
                })


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
  } = req.body;

  // Perform an SQL INSERT operation to add the business customer to the database
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
        //res.status(200).send('Business customer added successfully');
      }
      const BusinessSQL = `
        INSERT INTO Business (taxID, businessName, name, title, customerID)
        VALUES (?, ?, ?, ?, (SELECT customerID FROM Customer WHERE email = ? AND phoneNumber = ? AND  street = ? AND  city = ? AND  state = ? AND  postalCode = ?));
        `;
        con.query(BusinessSQL,
            [taxID, businessName,name,title,email, phoneNumber, street, city, state, postalCode],
            (err, result) => {
                if (err) 
                {
                    console.error('Error adding Business customer:', err);
                    res.status(500).send('Error adding Business customer');
                } 
                else 
                {
                    console.log('Business customer added successfully');
                    //res.status(200).send('Business customer added successfully');
                }

                const selectQuery = `SELECT C.CustomerID, C.email, C.phoneNumber, C.street, C.city, C.state, C.postalCode, B.taxID, B.businessName, B.name, B.title 
                FROM Customer AS C INNER JOIN Business AS B ON C.customerID = B.customerID 
                WHERE B.taxID = ?;`;
                con.query(selectQuery, [taxID],(err,selectResult) => {
                    if (err){
                        console.error('Error selecting business customer:', err);
                        res.status(500).send('Error selecting business customer');
                    }
                    else {
                        console.log('Business customer selected successfully');
                        //return res.json(result);
                        res.status(200).send(selectResult);
                    }
                })
            }
        );
    }
  );
};

const searchIndividualCustomer = (req, res) => {
    const driverLicense = req.query.driverLicense;
    const selectQuery = `SELECT C.CustomerID, C.email, C.phoneNumber, C.street, C.city, C.state, C.postalCode, I.driverLicense, I.firstName, I.lastName 
    FROM Customer AS C JOIN Individual AS I ON C.customerID = I.customerID 
    WHERE I.driverLicense = ?;`;
    //console.log('Driver license: ' + driverLicense);
    //console.log(selectQuery);

    con.query(selectQuery, [driverLicense],(err,selectResult) => {
        if (err){
            console.error('Error selecting individual customer:', err);
            res.status(500).send('Error selecting individual customer');
        }
        else if (selectResult.length === 0){
            console.error('Error selecting individual customer:', err);
            res.status(500).send('Error selecting individual customer');
        }
        else {
            console.log(selectResult);
            console.log('Individual customer selected successfully');
            //return res.json(result);
            res.status(200).send(selectResult);
        }
    })
}

const searchBusinessCustomer = (req, res) => {
    const taxID = req.query.taxID;
    const selectQuery = `SELECT C.CustomerID, C.email, C.phoneNumber, C.street, C.city, C.state, C.postalCode, B.taxID, B.businessName, B.name, B.title 
    FROM Customer AS C INNER JOIN Business AS B ON C.customerID = B.customerID 
    WHERE B.taxID = ?;`;

    console.log('taxID: ' + taxID);

                
    con.query(selectQuery, [taxID],(err,selectResult) => {
        if (err){
            console.error('Error selecting business customer:', err);
            res.status(500).send('Error selecting business customer');
        }
        else if (selectResult.length === 0){
            console.error('Error selecting business customer:', err);
            res.status(500).send('Error selecting business customer');
        }
        else {
            console.log('Business customer selected successfully');
            //return res.json(result);
            res.status(200).send(selectResult);
        }
    })

}

const searchCustomer = (req, res) => {
    const ID = req.query.ID;

    const businessQuery = `SELECT C.CustomerID, C.email, C.phoneNumber, C.street, C.city, C.state, C.postalCode, B.taxID, B.businessName, B.name, B.title 
        FROM Customer AS C INNER JOIN Business AS B ON C.customerID = B.customerID 
        WHERE B.taxID = ?;`;

    con.query(businessQuery, [ID], async (err1, businessResult) => {
        if (err1) {
            console.error('Error selecting business customer:', err1);
            return res.status(500).send('Error selecting business customer');
        }

        if (businessResult.length === 1) {
            console.log('Business customer selected successfully');
            return res.status(200).json(businessResult);
        }

        try {
            const individualQuery = `SELECT C.CustomerID, C.email, C.phoneNumber, C.street, C.city, C.state, C.postalCode, I.driverLicense, I.firstName, I.lastName 
                FROM Customer AS C JOIN Individual AS I ON C.customerID = I.customerID 
                WHERE I.driverLicense = ?;`;

            const individualResult = await queryAsync(con, individualQuery, [ID]);

            if (individualResult.length === 1) {
                console.log('Individual customer selected successfully');
                return res.status(200).json(individualResult);
            } else {
                console.error('No customer found');
                return res.status(404).send('No customer found');
            }
        } catch (err2) {
            console.error('Error selecting individual customer:', err2);
            return res.status(500).send('Error selecting individual customer');
        }
    });
};

// Helper function to promisify MySQL queries
const queryAsync = (con, query, values) => {
    return new Promise((resolve, reject) => {
        con.query(query, values, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = { addIndividualCustomer, addBusinessCustomer, searchIndividualCustomer, searchBusinessCustomer, searchCustomer };