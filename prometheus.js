const client = require('prom-client');

const collectDefaultMetrics = client.collectDefaultMetrics;

const { NODE_ENV } = process.env;

const serviceName = NODE_ENV === 'production' ? 'shobhan.openinapp.com' : 'shobhan.inopenapp.com';

if(NODE_ENV === 'production' || NODE_ENV === 'staging') {
    console.log('Metrics')
    collectDefaultMetrics({ 
        labels: {
            service_name: serviceName
        }
    });
}

module.exports = client;