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