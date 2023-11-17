const con = require('../connect');

const addCar = (req, res) => {
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
module.exports = { addCar };  