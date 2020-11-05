# Proxy - Traefik

![Treafik](/docs/assets/img/traefik-hero.png)

---

**Documentation**: <a href="https://docs.traefik.io/" target="_blank">https://docs.traefik.io/</a>

**Source Code**: <a href="https://github.com/traefik/traefik" target="_blank">https://github.com/traefik/traefik</a>

---

## Traefik introduction

Traefik is an open-source Edge Router that makes publishing your services a fun and easy experience. It receives requests on behalf of your system and finds out which components are responsible for handling them.

What sets Traefik apart, besides its many features, is that it automatically discovers the right configuration for your services. The magic happens when Traefik inspects your infrastructure, where it finds relevant information and discovers which service serves which request.

Traefik is natively compliant with every major cluster technology, such as Kubernetes, Docker, Docker Swarm, AWS, Mesos, Marathon, and the list goes on; and can handle many at the same time. (It even works for legacy software running on bare metal.)

With Traefik, there is no need to maintain and synchronize a separate configuration file: everything happens automatically, in real time (no restarts, no connection interruptions). With Traefik, you spend time developing and deploying new features to your system, not on configuring and maintaining its working state.

## Edge Router

Traefik is an Edge Router, it means that it's the door to your platform, and that it intercepts and routes every incoming request: it knows all the logic and every rule that determine which services handle which requests (based on the path, the host, headers, and so on ...).

## Auto Service Discovery

Where traditionally edge routers (or reverse proxies) need a configuration file that contains every possible route to your services, Traefik gets them from the services themselves.

Deploying your services, you attach information that tells Traefik the characteristics of the requests the services can handle.

It means that when a service is deployed, Traefik detects it immediately and updates the routing rules in real time. The opposite is true: when you remove a service from your infrastructure, the route will disappear accordingly.

You no longer need to create and synchronize configuration files cluttered with IP addresses or other rules.

## Launch Traefik With the Docker Provider
