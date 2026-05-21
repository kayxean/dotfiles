{
  description = "Isolated multi-language toolchain profile";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      packages.${system} = {
        vp = pkgs.stdenv.mkDerivation rec {
          pname = "vp";
          version = "0.1.22";

          src = pkgs.fetchurl {
            url = "https://registry.npmjs.org/@voidzero-dev/vite-plus-cli-linux-x64-gnu/-/vite-plus-cli-linux-x64-gnu-${version}.tgz";
            sha256 = "sha256-l/NWIy+DoUxjPJYyhzyxy3HZf2kEglZuyBPW87rSvj4=";
          };

          nativeBuildInputs = [ pkgs.autoPatchelfHook ];
          buildInputs = [ pkgs.stdenv.cc.cc.lib pkgs.glibc ];

          dontUnpack = true;
          installPhase = ''
            mkdir -p $out/bin $out/lib/vite-plus

            tar -xzf $src -C $out/bin --strip-components=1 package/vp
            autoPatchelf $out/bin/vp
            chmod +x $out/bin/vp

            echo '${builtins.toJSON {
              name = "vp-global";
              version = version;
              private = true;
              packageManager = "pnpm@10.33.0";
              dependencies = {"vite-plus" = version;};
            }}' > $out/lib/vite-plus/package.json

            cat > $out/bin/vp-init << 'INITEOF'
#!/usr/bin/env bash
set -euo pipefail
STORE_PATH="@STORE_PATH@"
VP_VERSION="@VP_VERSION@"
INSTALL_DIR="''${VP_HOME:-$HOME/.vite-plus}"
VERSION_DIR="$INSTALL_DIR/$VP_VERSION"
BIN_DIR="$VERSION_DIR/bin"
mkdir -p "$BIN_DIR"
ln -sf "$STORE_PATH/bin/vp" "$BIN_DIR/vp"
install -m 644 "$STORE_PATH/lib/vite-plus/package.json" "$VERSION_DIR/"
ln -sfn "$VP_VERSION" "$INSTALL_DIR/current"
mkdir -p "$INSTALL_DIR/bin"
ln -sf "../current/bin/vp" "$INSTALL_DIR/bin/vp"
(cd "$VERSION_DIR" && "$BIN_DIR/vp" install) 2>&1 || true
"$BIN_DIR/vp" env setup 2>&1 || true
INITEOF
            sed -i "s|@STORE_PATH@|$out|g; s|@VP_VERSION@|${version}|g" $out/bin/vp-init
            chmod +x $out/bin/vp-init
          '';
        };

        default = pkgs.symlinkJoin {
          name = "devrel";
          paths = [
            self.packages.${system}.vp
            pkgs.bun
            pkgs.rustup
            pkgs.zig
            pkgs.go
            pkgs.python3
            pkgs.lua
          ];
        };
      };
    };
}
