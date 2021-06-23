# Welcome to your CDK Cloudwatch Centralizer!

This is a project of TypeScript development with CDK to generate a dashboards' centralized solution on AWS Cloudwatch.

## Instructions

 *  `configure cdk`
     https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html
 
 * `add accounts into accounts.json`
 
 [
  {
     "id": "", // AWS Account Id
     "responsibility": "monitored", // "master", "monitor" ,"monitored"
     "organizationalUnitId": "" // Organizationl Unit ID from AWS Organizations 
   }
 ]

 *  run `npm install`   install all project's dependencies
 *  run `cdk bootstrap` 
 *  run `cdk deploy --require-approval never --all`


#### Tutorial about Assume Role Credential Plugin
 * https://github.com/aws-samples/cdk-assume-role-credential-plugin
