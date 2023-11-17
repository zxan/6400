const con = require('../connect');

exports.getCriterias = (req, res) => {
    let criterias = {
        "Vehicle Type": [],
        "Manufacturer": [],
        "Model Year": [],
        "Fuel Type": ['Gas', 'Diesel', 'Natural Gas', 'Hybrid', 'Plugin Hybrid', 'Battery', 'Fuel Cell'],
        "Color": []
    };

    const vehicleTypeQuery = 'SELECT type FROM VehicleType';
    con.query(vehicleTypeQuery, (err, results) => {
        if (err) { 
            res.status(500).send('Error with the database'); 
            return; 
        }
        criterias["Vehicle Type"] = results.map(result => result.type);


        const manufacturerQuery = 'SELECT company FROM Manufacturer';
        con.query(manufacturerQuery, (err, results) => {
            if (err) { 
                res.status(500).send('Error with the database'); 
                return; 
            }
            criterias["Manufacturer"] = results.map(result => result.company);


            const colorQuery = 'SELECT color FROM VehicleColor';
            con.query(colorQuery, (err, results) => {
                if (err) { 
                    res.status(500).send('Error with the database'); 
                    return; 
                }
                criterias["Color"] = results.map(result => result.color);


                let modelYears = [];
                const currentYear = new Date().getFullYear();
                for (let i = 1990; i <= currentYear + 1; i++) {
                    modelYears.push(i);
                }
                criterias["Model Year"] = modelYears;
     

                res.json(criterias); // this returns the final results 
            });
        });
    });
};



exports.searchCars = (req, res) => {
    let {vin=null, vehicleType = null, manufacturer = null, modelYear = null, fuelType = null, color = null, keyword = '', price = null, mileage = null,isAuthorized=null } = req.query;
    // Validation if no criteria are entered and the keyword field is empty
    if (!vin&&!vehicleType && !manufacturer && !modelYear && !fuelType && !color && !price && !mileage && !keyword) {
        return res.status(400).send("Please enter some keywords or choose at least one filtering criteria.");
    }
    let queryall = `
    SELECT 
    v.vin,
    ot.type,
    modelYear,
    mb.company AS manufacturer,
    modelName,
    fuelType,
    mileage,
    (1.1 * COALESCE((SELECT -- might not be in partorder, default to have part price 0
            SUM(P.cost * P.quantity)
        FROM
            PartOrder PO
                JOIN
            Part P ON P.orderNumber = PO.orderNumber
        WHERE
            PO.vin = v.vin),0) + 1.25 * (SELECT 
            s.purchasePrice
        FROM
            Sells_To s
        WHERE
            s.vin = v.vin)) AS price, -- This is a subquery to calculate the price
    GROUP_CONCAT(DISTINCT vc.color) AS colors -- concatenate all different colors in a row
FROM
    Vehicle v
        JOIN
    Of_Type ot ON v.vin = ot.vin
        JOIN
    Manufactured_By mb ON v.vin = mb.vin
        JOIN
    Of_Color vc ON v.vin = vc.vin
        
WHERE (v.vin= ? OR ? IS NULL) AND
    (ot.type = ?
        OR ? IS NULL)
        AND (? = v.modelYear
        OR ? IS NULL)  -- if it is null, will set to true
        AND (mb.company = ?
        OR ? IS NULL)
        AND (v.fuelType = ?
        OR ? IS NULL)
        AND (v.mileage <= ?
        OR ? IS NULL)
        AND (1.1 * COALESCE((SELECT 
            SUM(P.cost * P.quantity)
        FROM
            PartOrder PO
                JOIN
            Part P ON P.orderNumber = PO.orderNumber
        WHERE
            PO.vin = v.vin),0) + 1.25 * (SELECT 
            s.purchasePrice
        FROM
            Sells_To s
        WHERE
            s.vin = v.vin) <= ?
        OR ? IS NULL) -- This is a subquery to compare the sale price and the entered price.
        AND (ot.type LIKE CONCAT('%', ?, '%') -- This is to search through all the different fields that may include a keyword
        OR modelYear = ?
        OR mb.company LIKE CONCAT('%', ?, '%')
        OR modelName LIKE CONCAT('%', ?, '%')
        OR v.description LIKE CONCAT('%', ?, '%'))
GROUP BY v.vin; -- this groupby is for concatenating colors `;
    // Setting up the base query
    let query = `
    SELECT 
    v.vin,
    ot.type,
    modelYear,
    mb.company AS manufacturer,
    modelName,
    fuelType,
    mileage,
    (1.1 * COALESCE((SELECT -- might not be in partorder, default to have part price 0
            SUM(P.cost * P.quantity)
        FROM
            PartOrder PO
                JOIN
            Part P ON P.orderNumber = PO.orderNumber
        WHERE
            PO.vin = v.vin),0) + 1.25 * (SELECT 
            s.purchasePrice
        FROM
            Sells_To s
        WHERE
            s.vin = v.vin)) AS price, -- This is a subquery to calculate the price
    GROUP_CONCAT(DISTINCT vc.color) AS colors -- concatenate all different colors in a row
FROM
    Vehicle v
        JOIN
    Of_Type ot ON v.vin = ot.vin
        JOIN
    Manufactured_By mb ON v.vin = mb.vin
        JOIN
    Of_Color vc ON v.vin = vc.vin
        
WHERE (v.vin NOT IN ( -- filter out the cars that have not been installed
              SELECT p.vin
              FROM Part p
              WHERE p.status != 'installed'))
    AND (v.vin= ? OR ? IS NULL) AND
    (ot.type = ?
        OR ? IS NULL)
        AND (? = v.modelYear
        OR ? IS NULL)  -- if it is null, will set to true
        AND (mb.company = ?
        OR ? IS NULL)
        AND (v.fuelType = ?
        OR ? IS NULL)
        AND (v.mileage <= ?
        OR ? IS NULL)
        AND (1.1 * COALESCE((SELECT 
            SUM(P.cost * P.quantity)
        FROM
            PartOrder PO
                JOIN
            Part P ON P.orderNumber = PO.orderNumber
        WHERE
            PO.vin = v.vin),0) + 1.25 * (SELECT 
            s.purchasePrice
        FROM
            Sells_To s
        WHERE
            s.vin = v.vin) <= ?
        OR ? IS NULL) -- This is a subquery to compare the sale price and the entered price.
        AND (ot.type LIKE CONCAT('%', ?, '%') -- This is to search through all the different fields that may include a keyword
        OR modelYear = ?
        OR mb.company LIKE CONCAT('%', ?, '%')
        OR modelName LIKE CONCAT('%', ?, '%')
        OR v.description LIKE CONCAT('%', ?, '%'))
GROUP BY v.vin; -- this groupby is for concatenating colors `;

        let params = [
            vin,vin,
            vehicleType, vehicleType,
            modelYear, modelYear,
            manufacturer, manufacturer,
            fuelType, fuelType,
            mileage, mileage,
            price, price,
            keyword, keyword, keyword, keyword, keyword
        ];
    // Execute the query
    var querystring='';
    if (isAuthorized=="true"){
        querystring=queryall;
    }
    else{
        querystring=query;
    }
    con.query(querystring, params, (err, results) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Error with the database');
        }
        return res.json(results);
    });
};

exports.getCar = (req, res) => {
    const vin = req.query.vin; 
    const query = `
      SELECT v.vin, ot.type, v.modelYear, mb.company as manufacturer, v.modelName, fuelType, mileage, 
             GROUP_CONCAT(DISTINCT vc.color) AS colors, v.description,
             (1.1 * COALESCE((SELECT SUM(P.cost * P.quantity)
                              FROM PartOrder PO
                              JOIN Part P ON P.orderNumber = PO.orderNumber
                              WHERE PO.vin = v.vin), 0) +
              1.25 * (SELECT s.purchasePrice
                      FROM Sells_To s
                      WHERE s.vin = v.vin)) AS price  
      FROM Vehicle v 
      JOIN Of_Type ot ON v.vin = ot.vin
      JOIN Manufactured_By mb ON v.vin = mb.vin 
      JOIN Of_Color vc ON v.vin = vc.vin  
      WHERE v.vin = ? AND 
            v.vin NOT IN (SELECT p.vin
                          FROM Part p
                          WHERE p.status != 'installed')
      GROUP BY v.vin
      ORDER BY v.vin ASC;
    `;
  
    con.query(query, vin, (err, results) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Error with the database');
        }
        return res.json(results[0]);
    });
};

// getCarForInventoryClerk doesn't include part details. it may be combined with getCarForManager
exports.getCarForInventoryClerk = (req, res) => {
    const vin = req.query.vin; 
    const query = `
    SELECT v.vin, ot.type, v.modelYear, mb.company as manufacturer, v.modelName, fuelType, mileage, 
        GROUP_CONCAT(DISTINCT vc.color) AS colors, v.description,
        (1.1 * COALESCE((SELECT SUM(P.cost * P.quantity)
                          FROM PartOrder PO
                          JOIN Part P ON P.orderNumber = PO.orderNumber
                          WHERE PO.vin = v.vin), 0) +
            1.25 * (SELECT s.purchasePrice
                  FROM Sells_To s
                  WHERE s.vin = v.vin)) AS price, 
        (SELECT s.purchasePrice
          FROM Sells_To s
          WHERE s.vin = v.vin) AS purchasePrice,
        COALESCE((SELECT SUM(P.cost * P.quantity)
                  FROM PartOrder PO
                  JOIN Part P ON P.orderNumber = PO.orderNumber
                  WHERE PO.vin = v.vin), 0) AS totalPartsCost
    FROM Vehicle v 
    JOIN Of_Type ot ON v.vin = ot.vin
    JOIN Manufactured_By mb ON v.vin = mb.vin 
    JOIN Of_Color vc ON v.vin = vc.vin  
    WHERE v.vin = ? 
    -- the NOT-IN below might not be needed as those vehicles should not show up in the DisplayCarList page before CarDetial page
    AND v.vin NOT IN (SELECT bf.vin FROM Buys_From bf)
    GROUP BY v.vin
    ORDER BY v.vin ASC;          
    `;
  
    con.query(query, vin, (err, results) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Error with the database');
        }
        return res.json(results[0]);
    });
};

// getCarForInventoryClerk doesn't include part details. it may be combined with getCarForManager
exports.getCarForManager = (req, res) => {
    const vin = req.query.vin; 
    const query = `
    SELECT v.vin, ot.type, v.modelYear, mb.company as manufacturer, v.modelName, fuelType, mileage, 
        GROUP_CONCAT(DISTINCT vc.color) AS colors, v.description,
        (1.1 * COALESCE((SELECT SUM(P.cost * P.quantity)
                          FROM PartOrder PO
                          JOIN Part P ON P.orderNumber = PO.orderNumber
                          WHERE PO.vin = v.vin), 0) +
            1.25 * (SELECT s.purchasePrice
                  FROM Sells_To s
                  WHERE s.vin = v.vin)) AS price, 
        (SELECT s.purchasePrice
          FROM Sells_To s
          WHERE s.vin = v.vin) AS purchasePrice,
        COALESCE((SELECT SUM(P.cost * P.quantity)
                  FROM PartOrder PO
                  JOIN Part P ON P.orderNumber = PO.orderNumber
                  WHERE PO.vin = v.vin), 0) AS totalPartsCost
    FROM Vehicle v 
    JOIN Of_Type ot ON v.vin = ot.vin
    JOIN Manufactured_By mb ON v.vin = mb.vin 
    JOIN Of_Color vc ON v.vin = vc.vin  
    WHERE v.vin = ? 
    GROUP BY v.vin
    ORDER BY v.vin ASC;          
    `;
  
    con.query(query, vin, (err, results) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Error with the database');
        }
        return res.json(results[0]);
    });
};

// buyer, seller, inventoryclerk info 
exports.getCustomerAndUserForManager = (req, res) => {
    const vin = req.query.vin; 
    const query = `
    SELECT c.email AS sellerEmail, c.phoneNumber AS sellerPhoneNumber, c.street AS sellerStreet, c.city AS sellerCity, c.state AS sellerState, c.postalCode AS sellerPostalCode,
    u.firstName AS inventoryClerkFirstName, u.lastName AS InventoryClerkLastName, st.purchaseDate AS purchaseDate,
    cr.email AS buyerEmail, cr.phoneNumber AS buyerPhoneNumber, cr.street AS buyerStreet, cr.city AS buyerCity, cr.state AS buyerState, cr.postalCode AS buyerPostalCode,
    ur.firstName AS salespersonFirstName, ur.lastName AS salesPersonLastName, bf.transactionDate AS salesDate
    
    FROM Vehicle v 
    LEFT JOIN Buys_From bf on v.vin = bf.vin
    LEFT JOIN Sells_To st on v.vin = st.vin
    LEFT JOIN User u on u.username = st.username
    LEFT JOIN User ur on ur.username = bf.username
    LEFT JOIN Customer c on c.customerID = st.customerID
    LEFT JOIN Customer cr on cr.customerID = bf.customerID
    WHERE v.vin = ? 
    `;
  
    con.query(query, vin, (err, results) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Error with the database');
        }
        return res.json(results[0]);
    });
};


exports.hasBeenSold = (req, res) => {
    const vin = req.query.vin; 

    const query = `
    SELECT CASE 
        WHEN EXISTS (SELECT 1 FROM Buys_From WHERE vin = ?) THEN 1 ELSE 0 END AS hasBeenSold;
`;
    con.query(query, [vin], (err, result) => {
        if (err) {
            res.status(500).send('Error in database');
            return;
        }
        if (result[0].hasBeenSold === 0) {
            console.log(result[0]);
            res.json(false);
        } else {
           console.log(result[0]);
            res.json(true);
        }
    });
};


exports.sale = (req, res) => {

    console.log(req.body);

    const customerID = req.body.CustomerID; 
    const username = req.body.username; 
    const vin = req.body.vin; 
    const transactionDate = req.body.transactionDate; 

    console.log(customerID)
    console.log(username)
    console.log(vin)
    console.log(transactionDate)

    const query = `
        INSERT INTO Buys_from (customerID, username, vin, transactionDate)
        VALUES (?,?,?,?)`;
    
    con.query(query,
        [customerID, username,vin,transactionDate],
        (err, result) => {
            if (err) 
            {
                console.error('Error adding transaction:', err);
                res.status(500).send('Error adding sale transaction');
            } 
            else 
            {
                res.status(200).send('Sale transaction added successfully');
                console.log('Sale transaction added successfully');
            }
        }
    );
};

// number of vehicles available for customer's purchase. used after inventory clerks, managers, and owners log in
exports.countVehicleForPublic = (req, res) => {

    console.log(req.body);

    const query = `
    SELECT COUNT(v.vin) AS countVehicleForPublic FROM Vehicle v 
    JOIN Of_Type ot ON v.vin = ot.vin
    JOIN Manufactured_By mb ON v.vin = mb.vin 
    JOIN Of_Color vc ON v.vin = vc.vin  
    WHERE v.vin NOT IN (SELECT bf.vin FROM Buys_From bf) AND 
          v.vin NOT IN (SELECT p.vin
                        FROM Part p
                        WHERE p.status != 'installed')
    `;
    
    con.query(query,
        (err, result) => {
            if (err) 
            {
                console.error('Error counting the number of vehicles availabel for customer to purchase:', err);
                res.status(500).send('Error counting the number of vehicles availabel for customer to purchase');
            } 
            else 
            {
                res.status(200).send(result);
                console.log('Sale transaction added successfully');
            }
        }
    );
};

exports.addCar = (req, res) => {
    //console.log(req.body);
    const {
        customerID,
        vin,
        type,
        username,
        modelYear,
        company,
        modelName,
        fuelType,
        color,
        mileage,
        carCondition,
        purchaseDate,
        purchasePrice,
        description,
    } = req.body;  
    //Check if required fields are empty 

    // if (!vin || !type || !username || !modelYear || !company ||  !modelName || !fuelType || !color || !carCondition || !mileage || !customerID || !purchaseDate || !purchasePrice) {
    //     return res.status(500).send("Please provide input in required field.");
    // }
    //Check if purchase date is a date no later than current date 
    if (Date.parse(purchaseDate) < Date.now()) {
        console.log("Purchase date is in the past");
    } else {
        console.log("Purchase date is NOT in the past");
        res.status(500).send('Error with Purchase date');
        return;  
    }

    // Perform an SQL INSERT operation to add the car
    const carSQL = `
        INSERT INTO Vehicle (vin, modelYear, modelName, fuelType, mileage, description, carCondition) VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    con.query(
        carSQL,
        [vin, modelYear, modelName, fuelType, mileage, description, carCondition],
        (err, result) => {
        if (err) {
            console.error('Error adding car(Vehicle):', err);
            res.status(500).send('Error adding car(Vehicle)');
            return; 
        } else {
            console.log('Car added successfully(Vehicle)');
            //res.status(200).send('Customer added successfully');
        }
       
        const colorSQL = `
            INSERT INTO Of_Color (vin, color) VALUES (?, ?);`;
        con.query(
            colorSQL,
            [vin, color],
            (err, result) => {
            if (err) {
                console.error('Error adding car(of_color):', err);
                res.status(500).send('Error adding car(of_color)');
                return; 
            } else {
                console.log('Car added successfully(of_color)');
            //res.status(200).send('Customer added successfully');
            }
            });        
    // // Perform an SQL INSERT operation to add the car
        const carTypeSQL = `
            INSERT INTO Of_Type (vin, type) VALUES (?, ?);
        `;
        con.query(
            carTypeSQL,
            [vin, type],
            (err, result) => {
            if (err) {
                console.error('Error adding car(Of_Type):', err);
                res.status(500).send('Error adding car(Of_Type)');
                return; 

            } else {
                console.log('Car added successfully(Of_Type)');
            //res.status(200).send('Customer added successfully');
            }
            });

    // // Perform an SQL INSERT operation to add the car
        const carManuSQL = `
            INSERT INTO Manufactured_By (vin, company) VALUES (?, ?);
        `;
        con.query(
            carManuSQL,
            [vin, company],
            (err, result) => {
            if (err) {
                console.error('Error adding car(Manufactured_By):', err);
                res.status(500).send('Error adding car(Manufactured_By)');
                return; 

            } else {
                console.log('Car added successfully(Manufactured_By)');
            //res.status(200).send('Customer added successfully');
            }
            });

    // // Perform an SQL INSERT operation to add the car
        const carSellSQL = `
            INSERT INTO Sells_To (customerID,username, vin, purchaseDate, purchasePrice) VALUES ( 
                ?,
                 ?,
                ?, ?, ?);
        `;
        con.query(
            carSellSQL,
            [customerID, username, vin, purchaseDate, purchasePrice],
            (err, result) => {
            if (err) {
                console.error('Error adding car(Sells_To):', err);
                res.status(500).send('Error adding car(Sells_To)');
                return; 

            } else {
                console.log('Car added successfully(Sells_To)');
                // res.status(200).send("");
            //res.status(200).send('Customer added successfully');
            }
            });
        

        const carselectSQL = `
        SELECT v.vin, 
        st.customerID,
        ot.type,
        v.modelYear,
        mb.company AS manufacturer,
        v.modelName,
        v.fuelType,
        v.mileage,
        v.description,
        v.carCondition,
        st.purchasePrice,
        st.purchaseDate,
        st.username,
        GROUP_CONCAT(DISTINCT oc.color) AS colors -- concatenate all different colors in a row
        FROM
        Vehicle v
            JOIN
        Sells_to st ON v.vin = st.vin
            JOIN
        Of_Type ot ON v.vin = ot.vin
            JOIN
        Manufactured_By mb ON v.vin = mb.vin
            JOIN
        Of_Color oc ON v.vin = oc.vin
        where v.vin =?
        group by 1,2,3,4,5,6,7,8,9,10,11,12,13;
        `;
        con.query(
            carselectSQL,
            [vin],
            (err, result) => {
            if (err) {
                console.error('Error selecting car:', err);
                res.status(500).send('Error selecting car');
                return; 

            } else {
                console.log('Car selected successfully');
                res.status(200).send(result);
            }
            });

    });};
  