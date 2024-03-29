# data server  
Data Server:  A no configuration Data RESTfull API using Azure Functions and Node  
  
### Running with port 7073:  
  
Clone or download Zip  
  
```javascript
rename UPDATE.local.settings.json to local.settings.json
update "AZURE_STORAGE_CONNECTION_STRING" variable to a connection string in your Azure Portal storage. 
See Azure Function section below if you need to create an Azure Storage resource
```
  
**VS Code**  
```javascript
run from the debugger
```

**Terminal**  
```javascript
func start --port 7073
```  
  
**Azure Function**  
replace datachippdata with your function app name    
  
```
$ az login  
```
* if need to login as device:  $ az login --use-device-code  
  
If you do not have a resource group & storage already ...  
```javascript
$ az group create --name datachipp --location centralus
$ az storage account create --name datachippstorage --location centralus --resource-group datachipp --sku standard_lrs --kind StorageV2
```

Create function app and publish  
```javascript
$ az functionapp create --name datachippdata --storage-account datachippstorage --resource-group datachipp --consumption-plan-location centralus

$ func azure functionapp publish datachippdata
```

In Azure Portal
Select your resource group (datachipp)
Select your storage (datachippstorage)
Click on "Access keys"
Copy the connection string for key1

Select your function app (datachippdata) 
Click the "Platform features" tab   
Click the "Configuration" link
Click the "+ New application setting"

```javascript
Name  = AZURE_STORAGE_CONNECTION_STRING
Value = [Value is the connection string from key1]
```
Click OK and Save. You should see the app setting in the list  
  
  
## Testing  
There are 2 test files/scripts in the repo.  
  
test.http --> local testing  
   
testAzure.http --> Azure testing  
! update the @hostname= datachippdata.azurewebsites.net variable  
   
Both test perform CRUD test:    
Get all chipps   
  
Create the Chipp   
Read   the Chipp  
Update the Chipp  
Delete the Chipp  


## Roadmap
1. additional error handling  
2. add API Key for calling the functions  
3. integrate with proxy server  










