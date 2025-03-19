# Software Onboarding

- [Software Onboarding](#software-onboarding)
  - [Introduction](#introduction)
  - [Setting up](#setting-up)
    - [Windows](#windows)
    - [Mac](#mac)
    - [Linux](#linux)
      - [Ubuntu/Mint](#ubuntumint)
        - [Setting up Docker (Ubuntu/Mint)](#setting-up-docker-ubuntumint)
        - [Setting Up Git (Ubuntu/Mint)](#setting-up-git-ubuntumint)
        - [Setting Up a Development Environment (Ubuntu/Mint)](#setting-up-a-development-environment-ubuntumint)
      - [Arch](#arch)
      - [NixOS](#nixos)
        - [Setting up Docker (NixOS)](#setting-up-docker-nixos)
        - [Setting up Git (NixOS)](#setting-up-git-nixos)
        - [Setting up Development Environment (NixOS)](#setting-up-development-environment-nixos)
      - [Setting up SSH for Github](#setting-up-ssh-for-github)
  - [Introduction to Linux](#introduction-to-linux)
  - [Introduction to Docker](#introduction-to-docker)
  - [Introduction to Git/Github](#introduction-to-gitgithub)
  - [Introduction to Rust](#introduction-to-rust)
  - [Introduction to KubOS](#introduction-to-kubos)
  - [Getting Started](#getting-started)



## Introduction

This is designed to help onboard new members of the software team and provide a reference. This is primarily aimed at programmers with little to no experience with the tools we regularly use like Git/Github, Docker, Rust,

## Setting up

As a preface, I (the person writing this guide) have the most experience with Linux (specifically NixOS). If you encounter any issues with setup, feel free to let us know and we will update everything as soon as possible. 

Before getting started, make sure you have an appropriate Github account set up and enough storage space on your machine, 30 Gigabytes should be enough to get started. 

We generally recommend that your Github account is not tied to only your school email and instead have a personal, professional Github account for use in projects such as this. 

### Windows

### Mac

### Linux

For this section, I will assume a basic ability to work in the linux terminal.

#### Ubuntu/Mint

##### Setting up Docker (Ubuntu/Mint)

This is easiest done if you follow this tutorial by [Docker](https://docs.docker.com/engine/install/ubuntu/). For a condensed tutorial, do the following:

1. Install Using Apt
```sh
    sudo apt-get update
    sudo apt-get install ca-certificates curl
    sudo install -m 0755 -d /etc/apt/keyrings
    sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    sudo chmod a+r /etc/apt/keyrings/docker.asc

    # Add the repository to Apt sources:
    echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
```
2. Install Docker Packages
```sh
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```
3. Add Your User to the Docker Group (Allows running Docker without `sudo`)
```sh
sudo usermod -aG docker $USER
```
After this step, you will want to restart before continuing.

4. Verify Installation
```sh
docker run hello-world
```


##### Setting Up Git (Ubuntu/Mint)

```sh
sudo apt install -y git
```

Once installed, configure your Git user:
```sh
git config --global user.name "YourUsername"
git config --global user.email "youremail@example.com"
```

(Optional) Enable Git LFS:
```sh
git lfs install
```

Go here to [add SSH Key to Github](#setting-up-ssh-for-github).

##### Setting Up a Development Environment (Ubuntu/Mint)

Install Rust. Visit [this website](https://www.rust-lang.org/tools/install) for information.

#### Arch




#### NixOS
This has last been tested on NixOS 25.05

##### Setting up Docker (NixOS)
To setup Docker, add the following lines to your configuration.nix then run `sudo nixos-rebuild switch`:
```nix
users.users."<your_username>".extraGroups = [ "docker" ]; # adds a user to the docker group allowing them to run docker commands without sudo

virtualisation.docker.enable = true; #  enables docker

environment.systemPackages = with pkgs; [
    docker-compose # installs docker-compose
]
```

##### Setting up Git (NixOS)
To set up Git, add the following lines to your configuration.nix:
```nix
services.openssh.enable = true; 

programs.git = {
  enable = true; # enables git
  lfs.enable = true; # enable git lfs (not technically necessary but is used)
  config = [
    {
      user = {
        name = "YourUsername"; # git won't ask you to set on first run
        email = "youremail@example.com"; # git won't ask you to set on first run
      };
    }
  ];
};
```

Go here to [add SSH Key to Github](#setting-up-ssh-for-github).

##### Setting up Development Environment (NixOS)

In NixOS, setting up your programming environment is very simple. For most situations, the provided `shell.nix` file creates an appropriate development environment:
```nix
{ pkgs ? import <nixpkgs> { } }:
pkgs.mkShell {
  buildInputs = with pkgs.buildPackages; [   
    rustup
    openssl
  ];

  shellHook =
    ''
      rustup update stable

      clear
      rustc --version
      git --version
      echo "Environment ready" 
    '';

}
```

Just run `nix-shell` in a directory with a `shell.nix` file, and it will temporarily make the listed programs available in your shell without installing them system-wide. 

When you're finished, simply run `exit` to leave the environment, restoring your original system state.

**Clone Repositories**

TODO: Clone the docker-kubos repo 

#### Setting up SSH for Github

1. **Generate an SSH Key**
```sh
ssh-keygen -t ed25519 -C "your_email@example.com"
```
   - When prompted, save the key in `~/.ssh/id_ed25519`.
   - You can enter a passphrase or leave it empty.
2. **Start the SSH Agent and Add Your Key**
```sh
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

3. **Add Your SSH Key to GitHub**
   - Copy your public key:
```sh
cat ~/.ssh/id_ed25519.pub
```
   - Go to [GitHub SSH Keys](https://github.com/settings/keys), click **New SSH Key**, paste your key, and save.

4. **Test the Connection**
```sh
ssh -T git@github.com
```
   Expected output:
```
Hi github_username! You've successfully authenticated, but GitHub does not provide shell access.
```


## Introduction to Linux

See [linux.md](./1_linux.md)

## Introduction to Docker

See [docker.md](./2_docker.md)

## Introduction to Git/Github
See [github.md](./3_github.md)

## Introduction to Rust
See [rust.md](./4_rust.md)

## Introduction to KubOS
See [kubos.md](./5_kubos.md)

## Getting Started

Navigate to the `docker-kubos` repository you cloned earlier and run `docker compose up -d`. This will start up all 4 containers:
1. The KubOS Main Container
2. The ADCS Simulator
3. The PDU Simulator
4. The Event Camera Simulator
From there, go to [website] and play around