#!/bin/bash

PRIV="$(openssl ecparam -name secp256r1 -genkey -noout -out -)"
PUB=$(echo "$PRIV" | openssl ec -pubout)

PRIV_B64="$(echo "$PRIV" | base64)"
PUB_B64="$(echo "$PUB" | base64)"

echo $'JWT_ECDSA_PRIVATE_KEY=\"'"$PRIV_B64"$'\"' >> .env
echo $'JWT_ECDSA_PUBLIC_KEY=\"'"$PUB_B64"$'\"' >> .env