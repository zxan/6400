const con = require('../connect');



exports.getCriterias = (req, res) => {
    //this is where you basically put you abstract code and SQL query
    let criterias = {
        "Vehicle Type": [],
        "Manufacturer": [],
        "Model Year": [],
        "Fuel Type": ['Gas', 'Diesel', 'Natural Gas', 'Hybrid', 'Plugin Hybrid', 'Battery', 'Fuel Cell'],
        "Color": []
    };
    const vehicleTypeQuery = 'SELECT type FROM VehicleType';//write your query like this
    con.query(vehicleTypeQuery, (err, results) => {//this line execute the query and process it below
        if (err) { res.status(500).send('Error with the database'); return; }
        criterias["Vehicle Type"] = results.map(result => result.type);
        const manufacturerQuery = 'SELECT company FROM Manufacturer';
        con.query(manufacturerQuery, (err, results) => {//another query
            if (err) { res.status(500).send('Error with the database'); return; }
            criterias["Manufacturer"] = results.map(result => result.company);

            const colorQuery = 'SELECT color FROM VehicleColor';
            con.query(colorQuery, (err, results) => {
                if (err) { res.status(500).send('Error with the database'); return; }
                criterias["Color"] = results.map(result => result.color);
                let modelYears = [];
                const currentYear = new Date().getFullYear();
                for (let i = 1990; i <= currentYear + 1; i++) {
                    modelYears.push(i);
                }
                criterias["Model Year"] = modelYears;

                res.json(criterias);//this returns the final results 
            });
        });
    });
};



