<p align="center">
    <img src="https://github.com/user-attachments/assets/f511b797-ec50-4392-ae83-4fc9e8def001" alt="Build Status">
</p>

## Text Analysis Service

Separate service for text analysis.

## Development
1. update env file `TEXT_ANALYSIS_SERVICE_URL=http://localhost:3001`
2. open text analysis service directory `cd text-analysis-service`
3. install npm dependencies `npm install`
4. run `node index.js`
   
## Production
1. update env file `TEXT_ANALYSIS_SERVICE_URL=https://your-production-domain.com`
2. open text analysis service directory `cd text-analysis-service`
3. install pm2 `npm install pm2 -g`
4. run `pm2 start index.js --name text-analysis-service`
5. run `pm2 save`
6. run `pm2 startup`
