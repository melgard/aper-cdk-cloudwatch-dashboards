import * as cdk from "@aws-cdk/core";
import {AccountPrincipal, CompositePrincipal} from "@aws-cdk/aws-iam";
import {AwsAccount} from "../interfaces/aws-account";


export const allowedPrincipalsGenerator = (accountIds: Array<string>) => {
  const allowedAccountPrincipals = accountIds.map(id => new AccountPrincipal(id));
  const [firstPrincipal, ...additionalAllowedPrincipal] = allowedAccountPrincipals;
  return new CompositePrincipal(firstPrincipal, ...additionalAllowedPrincipal);
}


export interface StackSetInstanceProps {
  app: cdk.App;
  id: string;
  stackSetName: string;
  regions: Array<string>;
  targetAccounts: Array<AwsAccount>;
  templateBody: string;
}



export const stackSetDeployer = (props: StackSetInstanceProps): cdk.CfnStackSet => {
  const deployer = new cdk.Stack(props.app, `${props.stackSetName}Deployer`, {
    stackName: `${props.stackSetName}Deployer`
  })
  const organizationalUnitIds = getAccountOUIds(props.targetAccounts);
  return new cdk.CfnStackSet(deployer, props.id, {
    stackSetName: props.stackSetName,
    permissionModel: 'SERVICE_MANAGED',
    autoDeployment: {
      enabled: true,
      retainStacksOnAccountRemoval: false
    },
    capabilities: ['CAPABILITY_NAMED_IAM'],
    stackInstancesGroup: [
      {
        regions: props.regions,
        deploymentTargets: {
          organizationalUnitIds: organizationalUnitIds,
        },
      },
    ],
    templateBody: props.templateBody,
  });
}


export const getAccountIds = (accounts: Array<AwsAccount> = []) => {
  return accounts.map((account) => account.id);
}
export const getAccountOUIds = (accounts: Array<AwsAccount> = []): string[] => {
  return accounts.map((account) => {
    return account.organizationalUnitId || ''
  });
}
