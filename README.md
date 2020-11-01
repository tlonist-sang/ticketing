
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

8. Running skaffold dev creates pods listed in the yaml file, enlisting them to Google Cloud.    
9. From local environment (Docker for Mac), running kubectl get pods (or any other commands) goes to the Google Cloud setting preconfigured.    
    
## NPM modularization
1. Create npm account, make an organization. (Check email if it is the first time)
2. Create a subdirectory (or anywhere of one's own choice), initialize. (npm init -y)
3. If the project is typescript based, run. (tsc --init)
4. Add (or write) files for the module. Customize package.json file (name, version, description, types, files, script etc..)
5. Initialize as git repository. (git init)
6. Log into npm. (npm login)
7. Git add, commit and run npm publish.
8. Check from npmjs > MY_OWN_ORGANIZATION

## Testing 
- jest, supertest

## Authentication flow
- requireAuth, validateRequest (middlewares)

## Publish & Subscribe with NATs Server
Port-forwarding for NATS server (Forwarding localhost request to created pods)
kubectl port-forward [nats-id] [8222]:[8222] (localhost:8222/streaming)
kubectl port-forward [nats-id] [4222]:[4222] (nats server for publishing and listening)
- Dependencies: "node-nats-streaming"
- Components:
    - Publisher : publishes event on Stan.publish()
    - Listener : listens to events published through Stan.subscribe()
        - subscriptionOptions() -> configures subscription options
- Async Communication:
    
## DB Connection

## TypeScript with MongoDB
- interfaces 1: to create a new entity
- interfaces 2: to describe a saved document (might be different from interface 1)
- interfaces 3: to describe a model