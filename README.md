# Container Workshop

Containers have been popularized by _Docker, Inc._
and their tooling. The
concepts are thus often refered to as _docker_
things, e.g. _docker files_,
_docker images_, _docker containers_. However,
container technology is much more
than just Docker.

This is a hands-on workshop where you will learn
about container technology
through actual use, along with some of the tooling
that improves upon the
experience of developing and working with
containers. Any container technology
tools may be used to build images and run
containers, but Docker has been chosen
in the examples as it likely the most accessible
for the majority of people.

## Prerequisites

- Install a _container image build tool_ and _
  container runtime_, the simplest
  beeing the all-in-one solution [Docker
  Desktop](https://www.docker.com/products/docker-desktop/)
  . See [Docker
  FAQs](https://www.docker.com/pricing/faq/?utm_campaign=2022-08-31-desktop-update)
  for any questions regarding Docker Desktop. If
  using any other container image
  build tool or runtime, be sure to adapt the
  workshop's `docker` commands to
  fit your tools.
- [Git](https://git-scm.com/) - as you probably
  want
  to `git clone https://github.com/standeren/container-workshop.git`
- Create a user
  on [DockerHub](https://hub.docker.com/) or any
  other container
  image registry.

## Content

1. [Docker Desktop](./01-docker-desktop)
2. [Dockerfile](./02-dockerfile)
3. [Container Images](./03-container-images)
4. [Running Containers](./04-running-containers)
5. [Build and Publish Container Images](./05-build-and-publish)
6. [Docker Compose](./06-docker-compose)
7. [Vulnerability Scanning](./07-vulnerability-scanning)
8. [Extras](./08-extras)
9. [Solutions](./69-LF)
