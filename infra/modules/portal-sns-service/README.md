# portal-sns-service

Creates the staging SNS HTTP backend used by the portal review path.

Current scope:

- package the reviewed Lambda runtime sources into a zip artifact
- create the DynamoDB table that persists the SNS timeline
- create the Lambda execution role and DynamoDB access policy
- create the public Lambda Function URL and the minimum invoke permissions required for unauthenticated staging review

Known limitations:

- the DynamoDB persistence stores the demo timeline as a single item keyed by `current`, so it is intentionally scoped to low-volume staging/demo use and inherits DynamoDB's single-item size ceiling
- reserved concurrency defaults to `1`, which matches the staging demo assumption and avoids cross-instance write races in this narrow backend shape

This module is intentionally narrow to keep the existing static-site delivery path unchanged while formalizing the reviewed SNS staging backend in infrastructure.
