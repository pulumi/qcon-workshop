import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const bucket = new aws.s3.Bucket("my-bucket");

const task = new awsx.ecs.F

bucket.onObjectCreated("newObject", async (ev, ctx) => {
    console.log(JSON.stringify(ev));
});

export const bucketName = bucket.id;
