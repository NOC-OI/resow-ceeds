# Notes about the CI/CD pipeline

There is an automatic gitlab CI/CD pipeline in this repository. It is split into two jobs:

**Build:**

This job builds the docker container and tags it as docker-repo.bodc.me/oceaninfo/imfe-pilot/frontend:latest or uk-london-1.ocir.io/lrl8vbuxj1ma/frontend:latest

**Deploy:**

This pushes the built container to the BODC container registry. It then SSHs into the host called web, pulls this container and restarts it. This requires a gitlab-runner user to be present on both the build and web VM, an SSH key needs to be configured to allow build to SSH into web. The salt rules repository will create the user and allows a manually generated key to login, but it doesn't create that key. If you reinstall these VMs you'll have to create new SSH keys and update the salt rules (salt/user/gitlab-runner.sls) with the new keys. 

### Ensuring Docker is logged in
The gitlab-runner user on both the build and web VM must have manually logged into the docker registry using the command `docker login docker-repo.bodc.me` or `docker login uk-london-1.ocir.io`. We have a user dedicated to the CI/CD pipeline for this. 

### Firewall Complications
A further complication is that the NOC firewall only allows requests from the fixed IP of the gateway VM, since we can guarantee that nobody else will share this IP. To get around this the deploy script sets up an SSH SOCKS proxy on port 3128 via the gateway to push and pull the containers. The Docker configuration is set (via a Salt rule - salt/docker/proxy.sls) to use localhost:3128 as a proxy. You will need to have the SSH tunnel running to execute the docker login command above. This can be done by running `ssh -D 3128 -f -N gateway` before executing any docker login/push/pull commands. Stop the SSH tunnel with `pkill -f "ssh -D 3128 -f -N gateway"`.

