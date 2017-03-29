'use strict'

const AWS = require('aws-sdk');
const DDB = new AWS.DynamoDB({apiVersion: '2012-08-10', region: 'us-east-1'});
const TABLE_NAME = 'CarbCounter';

exports.putGramsOfCarbs = function(userId, date, gramsOfCarbs, cb) {
    var params = {
        TableName: TABLE_NAME,
        Item: {
            'userId': {
                S: userId
            },
            'date': {
                S: date
            },
            'gramsOfCarbs': {
                N: gramsOfCarbs
            }
        }
    };
    DDB.putItem(params, cb);
}

exports.readGramsOfCarbs = function(userId, date, cb) {
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
        ProjectionExpression: 'gramsOfCarbs'
    };
    DDB.getItem(params, cb);
}

exports.updateGramsOfCarbs = function(userId, date, gramsOfCarbs, cb) {
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
        UpdateExpression: 'ADD gramsOfCarbs :gramsOfCarbs',
        ExpressionAttributeValues: {
            ':gramsOfCarbs': {'N': gramsOfCarbs}
        },
        ReturnValues: 'ALL_NEW'
    };
    DDB.updateItem(params, cb);
}

exports.deleteGramsOfCarbs = function(userId, date, cb) {
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
        ConditionExpression: 'attribute_exists(gramsOfCarbs)',
        ReturnValues: 'ALL_OLD'
    };
    DDB.deleteItem(params, cb);
}
