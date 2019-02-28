import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";

export class RedisMaster extends pulumi.ComponentResource {
    public readonly host: pulumi.Output<string>;

    constructor(name: string, args: RedisMasterArgs, opts?: pulumi.ComponentResourceOptions) {
        super("qcon:redis:Master", name, args, opts);
        const childOpts = { ...opts, parent: this };
        const labels = pulumi.output(args).apply(args => ({
            app: args.app,
            tier: args.tier,
            role: "master",
        }));
        const masterDeployment = new k8s.apps.v1.Deployment(`${name}-master-deploy`, {
            metadata: {
                namespace: args.namespace,
                labels: labels,
            },
            spec: {
                selector: {
                    matchLabels: labels,
                },
                template: {
                    metadata: {
                        labels: labels,
                    },
                    spec: {
                        containers: [{
                            name: "master",
                            image: "k8s.gcr.io/redis:e2e",
                            resources: { requests: { cpu: "100m", memory: "100Mi" } },
                            ports: [{ containerPort: 6379 }]
                        }]
                    }
                }
            }
        }, childOpts);
        const masterService = new k8s.core.v1.Service(`${name}-master-svc`, {
            metadata: {
                namespace: args.namespace,
                labels: masterDeployment.metadata.apply(meta => meta.labels),
            },
            spec: {
                type: "ClusterIP",
                ports: [{ port: 6379, targetPort: 6379 }],
                selector: masterDeployment.spec.apply(spec => spec.template.metadata.labels),
            }
        }, childOpts);

        this.host = masterService.spec.apply(spec => spec.clusterIP);
        this.registerOutputs({});
    }
}

export interface RedisMasterArgs {
    namespace: pulumi.Input<string>;
    app: pulumi.Input<string>;
    tier: pulumi.Input<string>;
}

export class RedisReplica extends pulumi.ComponentResource {
    public readonly host: pulumi.Output<string>;

    constructor(name: string, args: RedisReplicaArgs, opts?: pulumi.ComponentResourceOptions) {
        super("qcon:redis:Replica", name, args, opts);
        const childOpts = { ...opts, parent: this };
        const labels = pulumi.output(args).apply(args => ({
            app: args.app,
            tier: args.tier,
            role: "slave",
        }));
        const deployment = new k8s.apps.v1.Deployment(`${name}-replica-deployment`, {
            metadata: {
                namespace: args.namespace,
            },
            spec: {
                selector: {
                    matchLabels: labels,
                },
                template: {
                    metadata: {
                        labels: labels,
                    },
                    spec: {
                        containers: [{
                            name: "replica",
                            image: "gcr.io/google_samples/gb-redisslave:v1",
                            resources: { requests: { cpu: "100m", memory: "100Mi" } },
                            // If your cluster config does not include a dns service, then to instead access an environment
                            // variable to find the master service's host, change `value: "dns"` to read `value: "env"`.
                            env: [
                                { name: "GET_HOSTS_FROM", value: "env" },
                                { name: "REDIS_MASTER_SERVICE_HOST", value: args.master.host },
                            ],
                            ports: [{ containerPort: 6379 }]
                        }]
                    }
                }
            }
        }, childOpts);
        const svc = new k8s.core.v1.Service(`${name}-replica-svc`, {
            metadata: {
                namespace: args.namespace,
                labels: deployment.metadata.apply(meta => meta.labels),
            },
            spec: {
                type: "ClusterIP",
                ports: [{ port: 6379, targetPort: 6379 }],
                selector: deployment.spec.apply(spec => spec.template.metadata.labels),
            },
        }, childOpts);

        this.host = svc.spec.apply(spec => spec.clusterIP);
        this.registerOutputs({});
    }
}

export interface RedisReplicaArgs {
    namespace: pulumi.Input<string>;
    master: RedisMaster;
    app: pulumi.Input<string>;
    tier: pulumi.Input<string>;
}

export class Redis extends pulumi.ComponentResource {
    public readonly master: RedisMaster;
    public readonly replica: RedisReplica;

    constructor(name: string, args: RedisArgs, opts?: pulumi.ComponentResourceOptions) {
        super("qcon:redis:Redis", name, {}, opts);
        const childOpts = { ...opts, parent: this };
        this.master = new RedisMaster(name, {
            namespace: args.namespace,
            app: args.app,
            tier: args.tier,
        }, childOpts);
        this.replica = new RedisReplica(name, {
            namespace: args.namespace,
            master: this.master,
            app: args.app,
            tier: args.tier,
        }, childOpts);
        this.registerOutputs({});
    }
}

export interface RedisArgs {
    namespace: pulumi.Input<string>;
    app: pulumi.Input<string>;
    tier: pulumi.Input<string>;
}
