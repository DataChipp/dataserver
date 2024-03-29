const azure = require('azure-storage');
const tableService = azure.createTableService();

//While the Node.js Storage v10 is having table storage implemented, I recommend wrapping table storage code into a promise structure.
async function deleteEntityAsync(tableService, ...args) {
    return new Promise((resolve, reject) => {
        let promiseHandling = (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        };
        args.push(promiseHandling);
        tableService.deleteEntity.apply(tableService, args);
    });
};

module.exports = async function (context, req) {
    context.log('Start ChippDelete');

    let tableName = req.params.table;;
    let partitionName = req.params.partition;
    let result;
    const id = req.params.id;

    if (id) {
        // create a temporary object with PartitionKey & RowKey of the item which should be deleted
        var item = { PartitionKey: partitionName, RowKey: id };

        try {
            result = await deleteEntityAsync(tableService, tableName, item);
            context.res.status(204).send();
        } catch (e) {
            context.log("Error: " + e);
            context.res.status(e.statusCode).json({ error: e });            
        }        
    }
    else {
        // item to delete can't be found since no ID was passed
        context.res.status(404).send();
    }
};