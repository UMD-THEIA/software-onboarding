{ pkgs ? import <nixpkgs> { } }:
pkgs.mkShell {
  buildInputs = with pkgs.buildPackages; [
    nodejs_24
  ];

  shellHook =
    ''
      npm install
      clear
      echo "Environment ready"
      # npm start
    '';

}