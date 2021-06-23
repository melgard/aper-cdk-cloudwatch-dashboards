import * as cdk from '@aws-cdk/core';
import {Stack, StackProps} from '@aws-cdk/core';
import {CfnServiceLinkedRole, ManagedPolicy, Role, ServicePrincipal} from "@aws-cdk/aws-iam";

export class ViewCloudwatchCrossAccountAndRegionsStack extends Stack {

  constructor(scope: cdk.Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new CfnServiceLinkedRole(this, 'CloudwatchCrossAccountLinkedRole', {
      awsServiceName: 'cloudwatch-crossaccount.amazonaws.com',
      description: 'Role for cloudwatch cross account description'
    });

  }

}
