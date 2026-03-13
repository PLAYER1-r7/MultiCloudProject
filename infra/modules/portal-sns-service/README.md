# portal-sns-service

Creates the staging SNS HTTP backend used by the portal review path.

Current scope:

- package the reviewed Lambda runtime sources into a zip artifact
- create the DynamoDB table that persists the SNS timeline
- create the Lambda execution role and DynamoDB access policy
- create the public Lambda Function URL and the minimum invoke permissions required for unauthenticated staging review

This module is intentionally narrow to keep the existing static-site delivery path unchanged while formalizing the reviewed SNS staging backend in infrastructure.
