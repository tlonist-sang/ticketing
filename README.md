
## Google SDK - Docker - Kubernetes - Skaffold flow
Goal: Manipulate Google Kubernetes Clusters in local environment using Skaffold

1. Make a Google cloud project (console.cloud.google.com)
    - Project ID is identifiable from ID section of *Select a project*
2. Kubernetes Engine > Create Kubernetes clusters
3. Register Google Cloud Build (for deploying built images to Google Cloud VM)
   - Running kubectl commands on local terminal reaches out for environments in local settings.
   - kubectl can manipulate Google Cloud Environments by installing Google Cloud SDK [cloud.google.com/sdk/docs/quickstarts]
   - Google Cloud SDK instruction
    - gcloud auth login (prompt for logging in, make sure to login with the account that created the project)
    - gcloud init, choose the ID of project created above
4. Configure Docker-for-mac to handle kubernetes cloud
   - gcloud container clusters get-credentials <cluster-name(ticketing-dev)>
5. Enable Google Cloudn Build (just click enable for Google Cloud Build from console.cloud.google)
6. Write Skaffold.yaml to use Google Cloud Build (us.gcr.io/<project-id>/<directory-name>)
7. Set ingress-nginx on google cloud cluster kubernetes.github.io/ingress-nginx    
   - [link](https://kubernetes.github.io/ingress-nginx/)
   - run kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.30.0/deploy/static/mandatory.yaml from **Cloud setting** from docker for mac.
   - run [this command](https://kubernetes.github.io/ingress-nginx/deploy/#gce-gke) 
   - The two commands above create a load balancer in the project of Google Cloud environment.
   - Check from Google Cloud Platform > Networking > Network services, check IP address.
    
## NPM modularization
1. Create npm account, make an organization. (Check email if it is the first time)
2. Create a subdirectory (or anywhere of one's own choice), initialize. (npm init -y)
3. If the project is typescript based, run. (tsc --init)
4. Add (or write) files for the module. Customize package.json file (name, version, description, types, files, script etc..)
5. Initialize as git repository. (git init)
6. Log into npm. (npm login)
7. Git add, commit and run npm publish.
8. Lo and behold! (from npmjs > MY_OWN_ORGANIZATION)

## Testing 
- jest, supertest

## Session with JWT 

## NATs Server
portforwarding for NATS server (forwarding localhost request to created pods)
kubectl port-forward [nats-id] [port1]:[port2]