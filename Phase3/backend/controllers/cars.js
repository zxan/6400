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