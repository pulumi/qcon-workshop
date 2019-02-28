import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";

import { Redis } from "./redis";
import { Frontend } from "./frontend";

const namespace = new k8s.core.v1.Namespace("qcon");
export const namespaceName = namespace.metadata.apply(meta => meta.name);
const redis = new Redis("redis", {
    namespace: namespaceName,
    app: "redis",
    tier: "backend",
});
const frontend = new Frontend("frontend", {
    namespace: namespaceName,
    redis: redis,
});

export const frontendUrl = pulumi.concat("http://", frontend.host);
