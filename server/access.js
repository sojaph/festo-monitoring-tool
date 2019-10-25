// var ADODB = require('node-adodb');
const config = require('config');
// ADODB.debug = true;
// Connect to the MS Access DB
// const connection = ADODB.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source=C:/Users/sophio/Desktop/UT/"Software Quality"/festo-monitoring-tool/server/data/FestoMES_Latest_after_error.accdb;Persist Security Info=False;');
const {Pool} = require('pg');
const pool = new Pool(config.get('database'));
class Access {
    static async getKPIs(){
        let res = {};
        try{
            // // Query the DB
            const ACT = await pool.query(`SELECT MAX(EXTRACT(seconds FROM "End" - start)) as ACT 
                                    FROM tblFinStep WHERE ono IN (2170, 2171, 2173, 2178, 2179, 2180)`);
            const PPT = await pool.query(`SELECT EXTRACT(epoch FROM MAX("End") - MIN(start)) as PPT 
                                        FROM tblFinStep WHERE ono IN (2170, 2171, 2173, 2178, 2179, 2180)`);
            const PT = await pool.query(`SELECT AVG(EXTRACT(seconds FROM "End" - start)) AS PT , description
                                    FROM tblFinStep
                                    WHERE ono IN (2170, 2171, 2173, 2178, 2179, 2180) GROUP BY description;`);
            const FT = await pool.query(`SELECT EXTRACT(seconds FROM "End" - start) AS FT 
                                            FROM tblFinStep 
                                            WHERE ono IN (2170, 2171, 2173, 2178, 2179, 2180) 
                                            AND errorstep = 1 AND start IS NOT NULL AND "End" IS NOT NULL;`);
            const total = await pool.query(`SELECT SUM(productsPerOrder) AS totalProducts 
                FROM (
                SELECT ono, COUNT(*) AS productsPerOrder 
                    FROM (
                        SELECT ono, opos, COUNT(*) AS num 
                        FROM tblFinStep WHERE ono IN (2170, 2171, 2173, 2178, 2179, 2180) 
                        GROUP BY ono, opos) AS sub
                    GROUP BY ono) AS sub2;`);
            const rejected = await pool.query(`SELECT COUNT(*) AS RP 
                                FROM tblFinStep 
                                WHERE ono IN (2170, 2171, 2173, 2178, 2179, 2180) 
                                AND errorstep = 1 AND start IS NOT NULL AND "End" IS NOT NULL;`);
            res.ICT = 165;
            res.ACT = ACT.rows[0].act;
            res.PT = PT.rows;
            res.PPT = PPT.rows[0].ppt - 3600;
            res.FT = FT.rows[0].ft;
            res.FP = total.rows[0].totalproducts - rejected.rows[0].rp;
            res.RP = rejected.rows[0].rp;
        } catch(e) {
            throw e;
        }
        return res;
    }
    static async getResourceCount(){
        let res = {};
        try{
            const resource = await pool.query(`SELECT SUM(EXTRACT(seconds FROM "End" - start)) AS "TotalTime" , r.description as "Description", r.resourcename as "ResourceName"
            FROM tblFinStep tfs LEFT OUTER JOIN tblResource r ON tfs.resourceid = r.resourceid
            WHERE tfs.ono IN (2170, 2171, 2173, 2178, 2179, 2180) GROUP BY r.description, r.resourcename;`);
            res.resource = resource.rows;
        } catch(e) {
            throw e;
        }
        return res;
    }
}

module.exports = Access;