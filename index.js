"use strict";
console.log("Loading function");
const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event));

  let name = "you";
  let city = "World";
  let time = "day";
  let day = "";
  let responseCode = 200;
  let dynamo_res;

  if (event.queryStringParameters && event.queryStringParameters.city) {
    city = event.queryStringParameters.city;
  }

  if (event.queryStringParameters && event.queryStringParameters.name) {
    name = event.queryStringParameters.name;
  }

  if (event.headers && event.headers["day"]) {
    day = event.headers.day;
  }

  if (event.body) {
    let body = JSON.parse(event.body);
    if (body.time) {
      time = body.time;
    }
  }
  let greeting = `Good ${time}, ${name} of ${city}.`;
  if (day) {
    greeting += `Happy ${day}`;
  }

  console.log(`Path Found as ${event.pathParameters.id}`);

  dynamo_res = await dynamo
    .get({
      TableName: "nsc_1",
      Key: {
        id: parseInt(event.pathParameters.id),
      },
    })
    .promise();
  let dynamo_res_json = JSON.stringify(dynamo_res);
  greeting += `Data from Dynamo: ${dynamo_res_json}`;

  let responseBody = {
    message: greeting,
    input: event,
  };

  let response = {
    statusCode: responseCode,
    headers: {
      "x-custom-header": "some header value",
    },
    body: JSON.stringify(responseBody),
  };
  console.log("response returned: " + JSON.stringify(response));
  return response;
};
