var ADODB = require('node-adodb');
ADODB.debug = true;
// Connect to the MS Access DB
const connection = ADODB.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source=C:/Users/jafar/Desktop/festo-monitoring-tool/server/data/FestoMES_Latest_after_error.accdb;Persist Security Info=False;');

class Access {
    static async getKPIs(){
        let res = {};
        try{
            // Query the DB
            const PTs = await connection.query(`SELECT AVG(DATEDIFF("s", PS, PE)) AS PPT, AVG(DATEDIFF("s", S, E)) AS PT 
            FROM (SELECT [ONo], [OPos], MIN([PlanedStart]) as PS, MAX([PlanedEnd]) AS PE, MIN([Start]) as S, MAX([End]) AS E 
            FROM tblFinStep WHERE [ONo] IN (2170, 2171, 2173, 2174, 2178, 2179, 2180) 
            GROUP BY [ONo], [OPos])`);
            const FT = await connection.query(`SELECT DATEDIFF("s", [Start], [End]) AS FT 
                                            FROM tblFinStep 
                                            WHERE [ONo] IN (2170, 2171, 2173, 2174, 2178, 2179, 2180) 
                                            AND ErrorStep = true AND [Start] IS NOT NULL AND [End] IS NOT NULL;`);
            const total = await connection.query(`SELECT SUM(productsPerOrder) AS totalProducts 
                FROM (
                SELECT [ONo], COUNT(*) AS productsPerOrder 
                    FROM (
                        SELECT [ONo], [OPos], COUNT(*) AS num 
                        FROM tblFinStep WHERE [ONo] IN (2170, 2171, 2173, 2174, 2178, 2179, 2180) 
                        GROUP BY [ONo], [OPos])
                    GROUP BY [ONo]);`);
            const rejected = await connection.query(`SELECT COUNT(*) AS RP 
                                FROM tblFinStep 
                                WHERE [ONo] IN (2170, 2171, 2173, 2174, 2178, 2179, 2180) 
                                AND [ErrorStep] = true AND [Start] IS NOT NULL AND [End] IS NOT NULL;`);
            res.PT = PTs[0].PT;
            res.PPT = PTs[0].PPT;
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
            const totalSteps = await connection.query(`SELECT COUNT(*) as [total] FROM tblFinStep 
                                                     WHERE tblFinStep.[ONo] IN (2170, 2171, 2173, 2174, 2178, 2179, 2180)`);
            const resource = await connection.query(`SELECT COUNT(*) as [Count], tfs.ResourceID, r.Description, r.ResourceName
            FROM tblFinStep tfs LEFT OUTER JOIN tblResource r ON r.ResourceID = tfs.ResourceID 
            WHERE tfs.[ONo] IN (2170, 2171, 2173, 2174, 2178, 2179, 2180)
            GROUP BY tfs.ResourceID, r.Description, r.ResourceName`);
            res.total = totalSteps[0].total;
            res.resource = resource;
        } catch(e) {
            throw e;
        }
        return res;
    }
}

module.exports = Access;