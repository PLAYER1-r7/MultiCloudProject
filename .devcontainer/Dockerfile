FROM mcr.microsoft.com/devcontainers/base:bookworm

ARG OPENTOFU_VERSION=1.8.8
ARG TARGETARCH

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    unzip \
    jq \
    make \
    bash-completion \
        gnupg \
    git \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg \
            | gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg \
        && echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" \
            > /etc/apt/sources.list.d/google-cloud-sdk.list \
        && apt-get update \
        && apt-get install -y --no-install-recommends google-cloud-cli \
        && rm -rf /var/lib/apt/lists/*

RUN tofu_arch="${TARGETARCH:-$(dpkg --print-architecture)}" \
    && case "$tofu_arch" in \
    amd64|arm64) ;; \
    *) echo "Unsupported architecture: $tofu_arch" >&2; exit 1 ;; \
    esac \
    && curl -fsSL https://github.com/opentofu/opentofu/releases/download/v${OPENTOFU_VERSION}/tofu_${OPENTOFU_VERSION}_${tofu_arch}.deb -o /tmp/tofu.deb \
    && apt-get update \
    && apt-get install -y /tmp/tofu.deb \
    && rm -f /tmp/tofu.deb \
    && rm -rf /var/lib/apt/lists/*