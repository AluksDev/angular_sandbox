#!/bin/bash

mkdir -p /etc/docker/certs.d/arquitectura-public-registry.ajuntament.bcn
openssl s_client -showcerts -connect arquitectura-public-registry.ajuntament.bcn:443 </dev/null | sed -ne '/-BEGIN CERTIFICATE-/,/-END CERTIFICATE-/p' >/etc/docker/certs.d/arquitectura-public-registry.ajuntament.bcn/ca.crt
