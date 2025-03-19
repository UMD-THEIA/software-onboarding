{ pkgs ? import <nixpkgs> { } }:
pkgs.mkShell {
  buildInputs = with pkgs.buildPackages; [
    nodejs_23
  ];

  shellHook =
    ''
      npm install
      clear
      echo "Environment ready"
      # npm start
    '';

}