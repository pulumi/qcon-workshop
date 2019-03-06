# Pulumi and Kubernetes

Pulumi doesn't just work for AWS - it also works great with Kubernetes! In this
step, we're going to deploy a simple application to a Kubernetes cluster using
Pulumi.

Before getting started, we must install a few prerequisite tools used to interact
with a Kubernetes cluster:

1. **kubectl**. To install kubectl, follow the directions most appropriate for
your platform on this site: https://kubernetes.io/docs/tasks/tools/install-kubectl/. 

    Once installed, run `kubectl --help`. You should see something like this:

    ```
    kubectl controls the Kubernetes cluster manager. 

    Find more information at: https://kubernetes.io/docs/reference/kubectl/overview/

    Basic Commands (Beginner):
    create         Create a resource from a file or from stdin.
    expose         Take a replication controller, service, deployment or pod and expose it as a new Kubernetes Service
    run            Run a particular image on the cluster
    set            Set specific features on objects
    run-container  Run a particular image on the cluster. This command is deprecated, use "run" instead

    Basic Commands (Intermediate):
    get            Display one or many resources
    explain        Documentation of resources
    edit           Edit a resource on the server
    delete         Delete resources by filenames, stdin, resources and names, or by resources and label selector

    Deploy Commands:
    rollout        Manage the rollout of a resource
    rolling-update Perform a rolling update of the given ReplicationController
    scale          Set a new size for a Deployment, ReplicaSet, Replication Controller, or Job
    autoscale      Auto-scale a Deployment, ReplicaSet, or ReplicationController

    Cluster Management Commands:
    certificate    Modify certificate resources.
    cluster-info   Display cluster info
    top            Display Resource (CPU/Memory/Storage) usage.
    cordon         Mark node as unschedulable
    uncordon       Mark node as schedulable
    drain          Drain node in preparation for maintenance
    taint          Update the taints on one or more nodes

    Troubleshooting and Debugging Commands:
    describe       Show details of a specific resource or group of resources
    logs           Print the logs for a container in a pod
    attach         Attach to a running container
    exec           Execute a command in a container
    port-forward   Forward one or more local ports to a pod
    proxy          Run a proxy to the Kubernetes API server
    cp             Copy files and directories to and from containers.
    auth           Inspect authorization

    Advanced Commands:
    apply          Apply a configuration to a resource by filename or stdin
    patch          Update field(s) of a resource using strategic merge patch
    replace        Replace a resource by filename or stdin
    convert        Convert config files between different API versions

    Settings Commands:
    label          Update the labels on a resource
    annotate       Update the annotations on a resource
    completion     Output shell completion code for the specified shell (bash or zsh)

    Other Commands:
    api-versions   Print the supported API versions on the server, in the form of "group/version"
    config         Modify kubeconfig files
    help           Help about any command
    plugin         Runs a command-line plugin
    version        Print the client and server version information

    Usage:
    kubectl [flags] [options]

    Use "kubectl <command> --help" for more information about a given command.
    Use "kubectl options" for a list of global command-line options (applies to all commands).
    ```

2. **aws-iam-authenticator**. We will be working with clusters managed by Amazon EKS,
so we must use `aws-iam-authenticator` to authenticate ourselves with our cluster. Follow the instructions on this site: https://docs.aws.amazon.com/eks/latest/userguide/install-aws-iam-authenticator.html.

    Once installed, run `aws-iam-authenticator --help`. You sould see something like this:

    ```
    A tool to authenticate to Kubernetes using AWS IAM credentials

    Usage:
    aws-iam-authenticator [command]

    Available Commands:
    help        Help about any command
    init        Pre-generate certificate, private key, and kubeconfig files for the server.
    server      Run a webhook validation server suitable that validates tokens using AWS IAM
    token       Authenticate using AWS IAM and get token for Kubernetes
    verify      Verify a token for debugging purpose
    version     Version will output the current build information

    Flags:
    -i, --cluster-id ID       Specify the cluster ID, a unique-per-cluster identifier for your aws-iam-authenticator installation.
    -c, --config filename     Load configuration from filename
    -h, --help                help for aws-iam-authenticator
    -l, --log-format string   Specify log format to use when logging to stderr [text or json] (default "text")

    Use "aws-iam-authenticator [command] --help" for more information about a command.
    ```

3. Download our `kubeconfig`. (TODO SEAN)

4. Run `kubectl get nodes`. You should see something like this:

    ```

    ```

You should now be ready to go!
