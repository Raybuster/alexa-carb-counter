'use strict'

const AWS = require('aws-sdk');
const DDB = new AWS.DynamoDB({apiVersion: '2012-08-10', region: 'us-east-1'});
const TABLE_NAME = 'ProteinTracker';

exports.putGramsOfProtein = function(userId, date, gramsOfProtein, cb) {
    var params = {
        TableName: TABLE_NAME,
        Item: {
            'userId': {
                S: userId
            },
            'date': {
                S: date
            },
            'gramsOfProtein': {
                N: gramsOfProtein
            }
        }
    };
    DDB.putItem(params, cb);
}

exports.readGramsOfProtein = function(userId, date, cb) {
    var params = {
        TableName: TABLE_NAME,
        Key: {
            'userId': {
                S: userId
            },
            'date': {
                S: date
            }
        },
        ProjectionExpression: 'gramsOfProtein'
    };
    DDB.getItem(params, cb);
}

exports.updateGramsOfProtein = function(userId, date, gramsOfProtein, cb) {
    var params = {
        TableName: TABLE_NAME,
        Key: {
            'userId': {
                S: userId
            },
            'date': {
                S: date
            }
        },
        UpdateExpression: 'ADD gramsOfProtein :gramsOfProtein',
        ExpressionAttributeValues: {
            ':gramsOfProtein': {'N': gramsOfProtein}
        },
        ReturnValues: 'ALL_NEW'
    };
    DDB.updateItem(params, cb);
}

exports.deleteGramsOfProtein = function(userId, date, cb) {
    var params = {
        TableName: TABLE_NAME,
        Key: {
            'userId': {
                S: userId
            },
            'date': {
                S: date
            }
        },
        ConditionExpression: 'attribute_exists(gramsOfProtein)',
        ReturnValues: 'ALL_OLD'
    };
    DDB.deleteItem(params, cb);
}
