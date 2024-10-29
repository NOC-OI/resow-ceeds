# CI/CD Pipeline Documentation

There is an automatic gitlab CI/CD pipeline in this project. It is split into this jobs:

## Build

The **Build** job is in charge of building the Docker container. The container is tagged based on the container registry name used in the project.

## Deploy

The **Deploy** job handles the deployment process. It pushes the built container to the Gitlab container registry. Subsequently, it SSHs into the host named "web" or "tiling", retrieves the container, and restarts it. This process requires the presence of a GitLab Runner user on both the build and web or tiling virtual machines. An SSH key must also be configured to allow the build to SSH into the web. Please note that while the salt rules repository can create the user and allow manual key generation for login, it does not generate that key. In the event of VM reinstallation, new SSH keys must be created, and the salt rules (salt/user/gitlab-runner.sls) must be updated with the new keys.

### Firewall Complications

Please be aware of potential complications with the NOC firewall, which only allows requests from the fixed IP of the gateway VM. To overcome this restriction, the deploy script sets up an SSH SOCKS proxy on port 3128 via the gateway for pushing and pulling containers. The Docker configuration is adjusted to use localhost:3128 as a proxy, which requires the SSH tunnel to be running. You can initiate the SSH tunnel with the command `ssh -D 3128 -f -N gateway` before executing any docker login, push, or pull commands. To stop the SSH tunnel, use `pkill -f "ssh -D 3128 -f -N gateway"`.
