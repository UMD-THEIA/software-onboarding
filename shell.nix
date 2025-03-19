{ pkgs ? import <nixpkgs> { } }:
pkgs.mkShell {
  buildInputs = with pkgs.buildPackages; [
    git
    
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