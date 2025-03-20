import '../../App.css'
import React from "react";
import CodeBlock from "../../CodeBlock";
import "./setup.css";
import { GithubSSH, GitClone } from "./common-setup"


export default function Nixos() {
  const dockerConfig = `users.users."<your_username>".extraGroups = [ "docker" ]; 
  
virtualisation.docker.enable = true; 
  
environment.systemPackages = with pkgs; [
  docker-compose 
];`;

  const gitSetup = `services.openssh.enable = true; 

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
};`;

const nixshell = `{ pkgs ? import <nixpkgs> { } }:
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
`;

  return (
    <div>
      <h2 className='setupText'>Setting up for NixOS</h2>
      <p className='setupText'>This has last been tested on NixOS 25.05</p>
      <h3 className='setupText'>Setting up Docker</h3>
      <p className='setupText'>Add the following to <code>configuration.nix</code>:</p>
      <CodeBlock language="nix" code={dockerConfig} />
      <p className='setupText'>Then run <code>sudo nixos-rebuild switch</code>. You may have to restart after this step.</p>
      <h3 className='setupText'>Setting up Git</h3>
      <p className='setupText'>To set up Git, add the following lines to your configuration.nix:</p>
      <CodeBlock language="nix" code={gitSetup} />
      <p className='setupText'>Then run <code>sudo nixos-rebuild switch</code>.</p>

      <GithubSSH />
      <h3 className='setupText'>Setting up Development Environment</h3>
     
      <p className='setupText'> In NixOS, setting up your programming environment is very simple.Just run <code>nix-shell</code> in a directory with a <code>shell.nix</code> file, and it will temporarily make the listed 
      programs available in your shell without installing them system-wide. This provided <code>shell.nix</code> file should be sufficient for almost any 
      task for the team.</p>
      <CodeBlock language="nix" code={nixshell} />
      
      <p className='setupText'>When you're finished, simply run <code>exit</code> to leave the environment, restoring your original system state.</p>
      <GitClone />
      <h3 className='setupText'>Fin.</h3>
    </div>
  );
};