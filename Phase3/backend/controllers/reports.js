const con = require('../connect');

exports.getSellerReports = (req, res) => {
    const sellerReportsQuery = `
        SELECT
        CASE
            WHEN B.businessName IS NOT NULL THEN B.businessName
            ELSE CONCAT(I.firstName, ' ', I.lastName)
        END AS sellerName,
        COUNT(DISTINCT ST.vin) AS totalNumberOfVehiclesSold,
        ROUND(AVG(1.1 * COALESCE(PT.partsCost, 0) + 1.25 * s.purchasePrice), 2) AS averageSoldPrice,
        ROUND(SUM(COALESCE(PO.partsOrdered, 0)) / NULLIF(COUNT(DISTINCT ST.vin), 0), 2) AS averageNumberOfPartsOrderedPerVehicle,
        CASE
            WHEN COALESCE(SUM(PT.partsCost), 0) / NULLIF(COUNT(DISTINCT ST.vin), 0) = 0 THEN 'N/A'
            ELSE ROUND(COALESCE(SUM(PT.partsCost), 0) / NULLIF(COUNT(DISTINCT ST.vin), 0), 2)
        END AS averageCostOfPartsPerVehicle,
        (SUM(COALESCE(PO.partsOrdered, 0)) / NULLIF(COUNT(DISTINCT ST.vin), 0) >= 5
        OR COALESCE(SUM(PT.partsCost), 0) / NULLIF(COUNT(DISTINCT ST.vin), 0) >= 500) AS redHighlighted
    FROM
            Buys_From BF
        LEFT JOIN Sells_To ST ON ST.vin = BF.vin
        LEFT JOIN Business B ON BF.customerID = B.customerID
        LEFT JOIN Individual I ON BF.customerID = I.customerID
        LEFT JOIN (
            SELECT
                PO.vin,
                SUM(P.quantity) AS partsOrdered
            FROM PartOrder PO
            JOIN Part P ON PO.vin = P.vin AND PO.orderNumber = P.orderNumber
            GROUP BY PO.vin
        ) AS PO ON BF.vin = PO.vin
        LEFT JOIN (
            SELECT
                PO.vin,
                SUM(P.quantity * P.cost * 1.10) AS partsCost
            FROM PartOrder PO
            JOIN Part P ON PO.vin = P.vin AND PO.orderNumber = P.orderNumber
            GROUP BY PO.vin
        ) AS PT ON BF.vin = PT.vin
        LEFT JOIN Sells_To s ON s.vin = BF.vin
        GROUP BY sellerName
        ORDER BY totalNumberOfVehiclesSold DESC, averageSoldPrice ASC;
    `;

    con.query(sellerReportsQuery, (err, results) => {
        if (err) {
            res.status(500).send('Error with the database');
            return;
        }
        
        results.forEach(result => {
            console.log('sellerName:', result.sellerName);
            console.log('totalNumberOfVehiclesSold:', result.totalNumberOfVehiclesSold);
            console.log('averageSoldPrice:', result.averageSoldPrice);
            console.log('averageNumberOfPartsOrderedPerVehicle:', result.averageNumberOfPartsOrderedPerVehicle);
            console.log('averageCostOfPartsPerVehicle:', result.averageCostOfPartsPerVehicle);
            console.log('redHighlighted:', result.redHighlighted);
        });

        // Process results before sending them
        const formattedResults = results.map(result => ({
            sellerName: result.sellerName,
            totalNumberOfVehiclesSold: result.totalNumberOfVehiclesSold,
            averageSoldPrice: result.averageSoldPrice,
            averageNumberOfPartsOrderedPerVehicle: result.averageNumberOfPartsOrderedPerVehicle,
            averageCostOfPartsPerVehicle: result.averageCostOfPartsPerVehicle,
            redHighlighted: result.redHighlighted
        }));

        res.json(formattedResults);
    });
};

exports.getAverageTime = (req, res) => {
    const AverageTimeQuery = `
    SELECT
        VehicleType.type,
        IFNULL(CAST(ROUND(AVG(DATEDIFF(Buys_From.transactionDate, Sells_To.purchaseDate)), 2) AS CHAR), 'N/A') AS averageTime
    FROM VehicleType
    LEFT JOIN Of_Type ON VehicleType.type = Of_Type.type
    LEFT JOIN Vehicle ON Vehicle.vin = Of_Type.vin
    LEFT JOIN Sells_To ON Sells_To.vin = Of_Type.vin
    LEFT JOIN Buys_From ON Of_Type.vin = Buys_From.vin 
    GROUP BY VehicleType.type;
    `;
  
    con.query(AverageTimeQuery, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Error with the database');
        return;
      }
      res.json(results);
    });
  };


  exports.getPriceReport = (req, res) => {
    const priceReportQuery = `
    SELECT
        VT.type AS VehicleType,
        Conditions.CarCondition,
        ROUND(AVG(
            CASE
                WHEN V.carCondition = Conditions.CarCondition
                THEN 1.1 * COALESCE(IndividualPartsCost, 0) + 1.25 * COALESCE(ST.purchasePrice, 0)
                ELSE 0
            END
        ), 2) AS AveragePrice
    FROM VehicleType VT
    CROSS JOIN (
        SELECT 'Excellent' AS CarCondition
        UNION ALL
        SELECT 'Very Good'
        UNION ALL
        SELECT 'Good'
        UNION ALL
        SELECT 'Fair'
    ) Conditions
    LEFT JOIN Of_Type OT ON VT.type = OT.type
    LEFT JOIN Vehicle V ON OT.vin = V.vin
    LEFT JOIN (
        SELECT 
            P.vin,
            COALESCE(SUM(P.cost * COALESCE(P.quantity, 0)), 0) AS IndividualPartsCost
        FROM Part P
        GROUP BY P.vin
    ) Parts ON V.vin = Parts.vin
    LEFT JOIN Sells_To ST ON V.vin = ST.vin
    GROUP BY VT.type, Conditions.CarCondition
    ORDER BY VT.type, FIELD(Conditions.CarCondition, 'Excellent', 'Very Good', 'Good', 'Fair');
    `;

    con.query(priceReportQuery, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error with the database');
            return;
        }
        res.json(results);
    });
};