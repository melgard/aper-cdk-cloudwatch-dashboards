import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Poc from '../lib/sharing-cloud-watch-data-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Poc.SharingCloudWatchDataStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
