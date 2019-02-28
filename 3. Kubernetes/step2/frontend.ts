import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import { Redis } from "./redis";

export class Frontend extends pulumi.ComponentResource {
    public readonly host: pulumi.Output<string>;

    constructor(name: string, args: FrontendArgs, opts?: pulumi.ComponentResourceOptions) {
        super("qcon:frontend:Frontend", name, args, opts);
        const labels = { app: "guestbook", tier: "frontend" };
        const childOpts = { ...opts, parent: this };
        const deployment = new k8s.apps.v1.Deployment(`${name}-deployment`, {
            metadata: {
                namespace: args.namespace,
            },
            spec: {
                selector: {
                    matchLabels: labels,
                },
                replicas: args.replicas || 2,
                template: {
                    metadata: {
                        namespace: args.namespace,
                        labels: labels,
                    },
                    spec: {
                        containers: [{
                            name: "php-redis",
                            image: "gcr.io/google-samples/gb-frontend:v4",
                            resources: {
                                requests: {
                                    cpu: "100m",
                                    memory: "100Mi"
                                }
                            },
                            env: [
                                {
                                    name: "GET_HOSTS_FROM",
                                    value: "env",
                                },
                                {
                                    name: "REDIS_MASTER_SERVICE_HOST",
                                    value: args.redis.master.host,
                                },
                                {
                                    name: "REDIS_SLAVE_SERVICE_HOST",
                                    value: args.redis.replica.host,
                                }
                            ],
                            ports: [{ containerPort: 80 }],
                        }]
                    }
                }
            }
        }, childOpts);

        const svc = new k8s.core.v1.Service(`${name}-svc`, {
            metadata: {
                namespace: args.namespace,
                labels: labels,
            },
            spec: {
                type: "LoadBalancer",
                ports: [{ port: 80 }],
                selector: labels,
            },
        }, childOpts);

        this.host = svc.status.apply(status => status.loadBalancer.ingress[0].ip);
        this.registerOutputs({});
    }
}

export interface FrontendArgs {
    namespace: pulumi.Input<string>;
    redis: Redis;
    replicas?: pulumi.Input<number>;
}
