const _ = require('../helper.js');
const azure = require('azure-storage');
const tableService = azure.createTableService();

//While the Node.js Storage v10 is having table storage implemented, I recommend wrapping table storage code into a promise structure.
async function replaceEntityAsync(tableService, ...args) {
    return new Promise((resolve, reject) => {
        let promiseHandling = (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        };
        args.push(promiseHandling);
        tableService.replaceEntity.apply(tableService, args);
    });
};

module.exports = async function (context, req) {
    context.log('Start ChippUpdate');

    let tableName = req.params.table;
    let partitionName = req.params.partition;
    let result;    

    const id = req.params.id;

    if (req.body) {
        // create a temporary object with PartitionKey & RowKey of the item which should be updated
        var item = req.body;
        item.RowKey = id;
        item.PartitionKey = partitionName;

        try {
            // Depending on how you want this to behave you can also use tableService.mergeEntity
            result = await replaceEntityAsync(tableService, tableName, item);
            result = _.entityToJSON(result, true);
            context.res.status(202).json(result);
        } catch (e) {
            context.log("Error: " + e);
            context.res.status(e.statusCode).json({ error: e });            
        }
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass an item in the request body"
        };
        context.done();
    }

};