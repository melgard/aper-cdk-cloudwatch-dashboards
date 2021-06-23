import * as cdk from '@aws-cdk/core';
import {PolicyDocument, PolicyStatement, Role} from "@aws-cdk/aws-iam";
import {allowedPrincipalsGenerator, getAccountIds} from "./helpers";
import {SharingStackProps} from "../interfaces/sharing-stack-props";

export class SharingOrganizationListStack extends cdk.Stack {

  constructor(scope: cdk.Construct, id: string, props?: SharingStackProps) {
    super(scope, id, props);
    const statement = new PolicyStatement({
      actions: [
        'organizations:ListAccounts',
        'organizations:ListAccountsForParent'
      ],
      resources: ['*']
    });
    const policyDocument = new PolicyDocument({statements: [statement]});

    new Role(this, 'CrossAccountSharingListAccountsRole', {
      roleName: 'CloudWatch-CrossAccountSharing-ListAccountsRole',
      assumedBy: allowedPrincipalsGenerator(getAccountIds(props?.accounts)),
      inlinePolicies: {
        "CloudWatch-CrossAccountSharing-ListAccounts-Policy": policyDocument
      }
    });
  }
}
