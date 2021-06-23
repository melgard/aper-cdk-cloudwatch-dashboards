export interface AwsAccount {
  id: string;
  organizationalUnitId?: string;
  responsibility?: ResponsibilityAccountType;
}


export enum ResponsibilityAccountType {
  MASTER= 'master',
  MONITOR= 'monitor',
  MONITORED= 'monitored',

}
