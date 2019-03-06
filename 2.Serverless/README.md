# 1. Intro

## Setup

1. Ensure you have completed the [Workshop setup directions](../README.md)
1. Complete the [previous section](../1.Intro) or grab the code from the [`step1`](../1.Intro/step1) folder as a starting point. 

## Steps

### Step 1

1. Start with the same code as the previous section in `step1` (or remove some code from what you added in `step3`):

    ```typescript
    import * as pulumi from "@pulumi/pulumi";
    import * as aws from "@pulumi/aws";

    const bucket = new aws.s3.Bucket("my-bucket");

    // Add new code here

    export const bucketName = bucket.id;
    ```

1. Add an event handler:

    ```typescript
    bucket.onObjectCreated("newObject", async (ev, ctx) => {
        console.log(JSON.stringify(ev);
    });
    ```

1. Update the deployment:

    ```
    $ pulumi up
    ```

1. Put a file in the S3 bucket:

    ```
    $ aws s3 cp ./package.json s3://$(pulumi stack output bucketName)
    ```

1. View the logs and wait for the logged message to appear:

    ```
    $ pulumi logs --follow
    ```

1. The end result of the steps so far is available in the [step1](./step1) folder.

### Step 2

1. Start with the same code as the previous section in `step1` (or remove some code from what you added in `step3`):

    ```typescript
    import * as pulumi from "@pulumi/pulumi";
    import * as aws from "@pulumi/aws";

    const bucket = new aws.s3.Bucket("my-bucket");

    // Add new code here

    export const bucketName = bucket.id;
    ```

1. Add an event handler:

    ```typescript
    bucket.onObjectCreated("newObject", async (ev, ctx) => {
        console.log(JSON.stringify(ev);
    });
    ```

1. Update the deployment:

    ```
    $ pulumi up
    ```

1. Put a file in the S3 bucket:

    ```
    $ aws s3 cp ./package.json s3://$(pulumi stack output bucketName)
    ```

1. View the logs and wait for the logged message to appear:

    ```
    $ pulumi logs --follow
    ```

1. The end result of the steps so far is available in the [step1](./step1) folder.
