import * as cdk from '@aws-cdk/core';
import {CrossAccountRole} from "../classes/cross-account-role";
import {SharingStackProps} from "../interfaces/sharing-stack-props";
import {getAccountIds} from "./helpers";
import {AwsAccount} from "../interfaces/aws-account";
import {Stack} from "@aws-cdk/core";

export interface SharingCloudWatchDataStackProps extends Omit<SharingStackProps, 'accounts'> {
  monitorAccounts: Array<AwsAccount>
}

export class SharingCloudWatchDataStack extends Stack {

  constructor(scope: cdk.Construct, id: string, props?: SharingCloudWatchDataStackProps) {
    super(scope, id, props);
    new CrossAccountRole(this, 'CloudWatchCrossAccountSharingRole', {
      roleName: 'CloudWatch-CrossAccountSharingRole',
      accountsIds: getAccountIds(props?.monitorAccounts),
      managedPoliciesNames: [
        "CloudWatchReadOnlyAccess",
        "CloudWatchAutomaticDashboardsAccess",
        "AWSXrayReadOnlyAccess"
      ]
    });

    new CrossAccountRole(this, 'AllowMonitoringAccountAccess', {
      roleName: 'AllowMonitoringAccountAccess',
      accountsIds: getAccountIds(props?.monitorAccounts),
      managedPoliciesNames: [
        "CloudWatchReadOnlyAccess",
        "ResourceGroupsandTagEditorReadOnlyAccess",
      ]
    });


  }
}
