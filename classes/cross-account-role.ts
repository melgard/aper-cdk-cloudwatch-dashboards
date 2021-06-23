import {
  AccountPrincipal,
  CompositePrincipal,
  IManagedPolicy,
  ManagedPolicy,
  Role,
  ServicePrincipal
} from "@aws-cdk/aws-iam";
import * as cdk from "@aws-cdk/core";
import {RoleProps} from "@aws-cdk/aws-iam/lib/role";
import {IPrincipal} from "@aws-cdk/aws-iam/lib/principals";
import {allowedPrincipalsGenerator} from "../lib/helpers";



export interface CrossAccountRoleProps extends Omit<RoleProps, 'assumedBy'> {
  accountsIds: Array<string>;
  managedPoliciesNames: Array<string>;
  assumedBy?: IPrincipal;
}

export class CrossAccountRole extends Role {
  constructor(scope: cdk.Construct, id: string, props: CrossAccountRoleProps) {
    super(scope, id, {
      ...props,
      assumedBy: allowedPrincipalsGenerator(props.accountsIds),
      roleName: props.roleName,
      description: 'This role allow us assume roles from another aws account',
    });

    props.managedPoliciesNames.forEach((policyName: string) => {
      const policy: IManagedPolicy = ManagedPolicy.fromAwsManagedPolicyName(policyName);
      this.addManagedPolicy(policy)
    });
  }
}
