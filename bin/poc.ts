#!/usr/bin/env node
import {join} from "path";
import {readFileSync} from "fs";

import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import {SharingCloudWatchDataStack} from "../lib/sharing-cloud-watch-data-stack";
import {stackSetDeployer} from "../lib/helpers";
import {SharingOrganizationListStack} from "../lib/sharing-organization-list-stack";
import {AwsAccount, ResponsibilityAccountType} from "../interfaces/aws-account";
import {ViewCloudwatchCrossAccountAndRegionsStack} from "../lib/view-cloudwatch-cross-account-and-regions-stack";

const app = new cdk.App();

const childStage = new cdk.Stage(app, "childStage")

const monitorStage = new cdk.Stage(app, "monitorStage");

const awsAccounts: Array<AwsAccount> = JSON.parse(readFileSync(join(__dirname, '..', 'accounts.json')).toString()) as Array<AwsAccount>;

// Este esta crea los recursos necesarios para compartir la lista de OUs de la cuenta
// Con las cuentas que tengan responsabilidades de monitoreo.
new SharingOrganizationListStack(app, 'SharingOrganizationListStack', {
  stackName: 'Cloudwatch-SharingOrganizationListStack',
  accounts: awsAccounts.filter(aws => aws.responsibility === ResponsibilityAccountType.MONITOR)
})

// Este stack crea los recursos para desplegar en las cuentas child
// el permiso para visualizar la data
new SharingCloudWatchDataStack(childStage, 'SharingCloudWatchDataStack', {
    stackName: 'CloudWatch-CrossAccountSharingRoleStack',
    monitorAccounts: awsAccounts.filter(aws => aws.responsibility === ResponsibilityAccountType.MONITOR)
  }
);

// Este stack crea los recursos para desplegar en la management
// el permiso para visualizar la data desde las cuentas child
new ViewCloudwatchCrossAccountAndRegionsStack(monitorStage, 'ViewCloudwatchCrossAccountAndRegionsStack', {
    stackName: 'CloudWatch-ViewCrossAccountAndRegionsStack',
  }
);

// Stack set cuentas monitoreadas
const stackSet = stackSetDeployer({
  app: app,
  id: 'CloudwatchChildrenStackSetId',
  stackSetName: 'ChildrenStackSet',
  regions: ['us-east-1'],
  targetAccounts: awsAccounts.filter(aws => aws.responsibility === ResponsibilityAccountType.MONITORED),
  templateBody: JSON.stringify(childStage.synth().stacks[0].template)
});

// Stack set cuenta monitor
stackSetDeployer({
  app: app,
  id: 'CloudwatchMonitorStackSetId',
  stackSetName: 'MonitorStackSet',
  regions: ['us-east-1'],
  targetAccounts: awsAccounts.filter(aws => aws.responsibility === ResponsibilityAccountType.MONITOR),
  templateBody: JSON.stringify(monitorStage.synth().stacks[0].template),
});

app.synth();

