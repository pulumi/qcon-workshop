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

1. Add a Fargate TaskDefinition

    ```typescript
    const task = new awsx.ecs.FargateTaskDefinition("task", {
        container: {
            image: "hello-world",
            memoryReservation: 512,
        },
    });
    const cluster = awsx.ecs.Cluster.getDefault();
    ```

1. Update the deployment:

    ```
    $ pulumi up
    ```

1. Replace the `bucket.onObjectCreated` section with the following:

    ```typescript
    bucket.onObjectCreated("newObject", async (ev, ctx) => {
        console.log("starting...")
        const res = await task.run({
            cluster: cluster,
        });
        console.log("done!");
        console.log(JSON.stringify(res));
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

1. You will see an error like the following in the logs:

    ```
    User: arn:aws:sts::153052954103:assumed-role/newObject-6696aa9/newObject-32c56b6 is not authorized to perform: ecs:RunTask on resource: arn:aws:ecs:eu-west-1:153052954103:task-definition/task-9a5ad092:1
    ```

1. Replace the `bucket.onObjectCreated` with the following:

    ```typescript
    const handler = new aws.lambda.CallbackFunction<aws.s3.BucketEvent, void>("newObject", {
        callback: async (ev, ctx) => {
            console.log("starting...")
            const res = await task.run({
                cluster: cluster,
            });
            console.log("done!");
            console.log(JSON.stringify(res));
        },
        policies: [
            aws.iam.AWSLambdaBasicExecutionRole,
            aws.iam.AmazonEC2ContainerServiceFullAccess,
        ],
    });

    bucket.onObjectCreated("newObject", handler);
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

1. This time, you will see output that includes this message from the `hello-world` container:

    ```
    Hello from Docker!
    ```


