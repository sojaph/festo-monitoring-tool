var ADODB = require('node-adodb');
ADODB.debug = true;
// Connect to the MS Access DB
const connection = ADODB.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source=C:/Users/jafar/Desktop/mern/server/data/Festo_line_TalTech.accdb;Persist Security Info=False;');

class Access {
    static async try(){
        let res;
        try{
            // Query the DB
            res = await connection.query('SELECT ONo, [End] - [Start] as timeTaken FROM tblFinOrder;');
        } catch(e) {
            throw e;
        }
        return res;
    }
    static async getResourceCount(){
        let res;
        let totalSteps;
        try{
            totalSteps = await connection.query('SELECT COUNT(*) as [total] FROM tblFinStep');
            res = await connection.query('SELECT COUNT(*) as [count], tblFinStep.ResourceID, r.Description FROM tblFinStep LEFT OUTER JOIN tblResource r ON r.ResourceID = tblFinStep.ResourceID GROUP BY tblFinStep.ResourceID, r.Description');
            res.forEach(element => {
                element["total"] = totalSteps;
            });
        } catch(e) {
            throw e;
        }
        return res;
    }
}

module.exports = Access;