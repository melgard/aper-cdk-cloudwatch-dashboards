import {StackProps} from "@aws-cdk/core";
import {AwsAccount} from "./aws-account";

export interface SharingStackProps  extends StackProps {
  accounts: Array<AwsAccount>
}
