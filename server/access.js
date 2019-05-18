var ADODB = require('node-adodb');
ADODB.debug = true;
// Connect to the MS Access DB
const connection = ADODB.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source=C:/Users/jafar/Desktop/festo-monitoring-tool/server/data/FestoMES_Latest_after_error.accdb;Persist Security Info=False;');

class Access {
    static async getKPIs(){
        let res = {};
        try{
            // Query the DB
            const ACT = await connection.query(`SELECT MAX(DATEDIFF("s", [Start], [End])) as ACT 
                                    FROM tblFinStep WHERE [ONo] IN (2170, 2171, 2173, 2178, 2179, 2180)`);
            const PPT = await connection.query(`SELECT DATEDIFF("s", MIN([Start]), MAX([End])) as PPT 
                                    FROM tblFinStep WHERE [ONo] IN (2170, 2171, 2173, 2178, 2179, 2180)`);
            const PT = await connection.query(`SELECT AVG(DATEDIFF("s", [Start], [End])) AS PT , [Description]
                                    FROM tblFinStep
                                    WHERE [ONo] IN (2170, 2171, 2173, 2178, 2179, 2180) GROUP BY [Description];`);
            const FT = await connection.query(`SELECT DATEDIFF("s", [Start], [End]) AS FT 
                                            FROM tblFinStep 
                                            WHERE [ONo] IN (2170, 2171, 2173, 2178, 2179, 2180) 
                                            AND ErrorStep = true AND [Start] IS NOT NULL AND [End] IS NOT NULL;`);
            const total = await connection.query(`SELECT SUM(productsPerOrder) AS totalProducts 
                FROM (
                SELECT [ONo], COUNT(*) AS productsPerOrder 
                    FROM (
                        SELECT [ONo], [OPos], COUNT(*) AS num 
                        FROM tblFinStep WHERE [ONo] IN (2170, 2171, 2173, 2178, 2179, 2180) 
                        GROUP BY [ONo], [OPos])
                    GROUP BY [ONo]);`);
            const rejected = await connection.query(`SELECT COUNT(*) AS RP 
                                FROM tblFinStep 
                                WHERE [ONo] IN (2170, 2171, 2173, 2178, 2179, 2180) 
                                AND [ErrorStep] = true AND [Start] IS NOT NULL AND [End] IS NOT NULL;`);
            res.ICT = 165;
            res.ACT = ACT[0].ACT;
            res.PT = PT;
            res.PPT = PPT[0].PPT - 3600;
            res.FT = FT[0].FT;
            res.FP = total[0].totalProducts - rejected[0].RP;
            res.RP = rejected[0].RP;
        } catch(e) {
            throw e;
        }
        return res;
    }
    static async getResourceCount(){
        let res = {};
        try{
            const resource = await connection.query(`SELECT SUM(DATEDIFF("s", [Start], [End])) AS TotalTime , r.[Description], r.[ResourceName]
            FROM tblFinStep tfs LEFT OUTER JOIN tblResource r ON tfs.ResourceID = r.ResourceID
            WHERE tfs.[ONo] IN (2170, 2171, 2173, 2178, 2179, 2180) GROUP BY r.[Description], r.ResourceName;`);
            res.resource = resource;
        } catch(e) {
            throw e;
        }
        return res;
    }
}

module.exports = Access;