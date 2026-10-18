import '../../App.css'
import './codebase.css'
import CodeBlock from "../../CodeBlock.js"
import TutorialNote from '../tutorials/TutorialNote.js'
import { Link } from "react-router-dom"



export default function NixDockerKubos() {


  function CustomLink({ to, children, ...props }) {
    return (
      <Link to={to} {...props}>
        {children}
      </Link>
    )
  }

  const buildLocal = `git clone --recurse-submodules -b nix git@github.com:UMD-THEIA/docker-kubos.git
cd docker-kubos
git checkout v0.3.7      # optional: build exactly the published release instead of the branch tip
nix flake check         # runs the smoke tests (optional, CI runs these too)
nix build .#docker       # produces ./result, a docker image tarball
docker load -i result    # loads it as kubos-container:latest`;

  const release = `git tag v0.3.8
git push origin v0.3.8`;

  const inputs = `inputs = {
  nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.11";
  rust-overlay.url = "github:oxalica/rust-overlay";
};`;

  const rustToolchain = `rustToolchain = pkgs.rust-bin.stable."1.80.0".default.override {
  targets = [
    "arm-unknown-linux-gnueabihf"
  ];
  extensions = [
    "rust-src"
    "clippy"
    "rustfmt"
  ];
};`;

  const envSnippet = `"CARGO_TARGET_ARM_UNKNOWN_LINUX_GNUEABIHF_LINKER=armv7l-unknown-linux-gnueabihf-gcc"
"PKG_CONFIG_ALLOW_CROSS=1"
"PKG_CONFIG_PATH=\${armEudev}/lib/pkgconfig"
"CARGO_TARGET_ARM_UNKNOWN_LINUX_GNUEABIHF_RUSTFLAGS=-L \${armEudev}/lib"`;

  const retag = `docker login ghcr.io
docker pull ghcr.io/umd-theia/docker-kubos:v0.3.7
docker tag ghcr.io/umd-theia/docker-kubos:v0.3.7 kubos-container:latest`;

  return (
    <>
      <div className="leftText">
        <h1><a href="https://github.com/UMD-THEIA/docker-kubos/tree/nix" target="_blank" rel="noreferrer">docker-kubos (Nix)</a></h1>
        <h3 className="lastUpdate">Last updated October 18th, 2026</h3>

        <p>The KubOS image is now built by a Nix flake (<code>flake.nix</code>) instead of the
          old <CustomLink to="/codebase/docker-kubos">Dockerfile</CustomLink>. The same image runs the flight software alongside the hardware simulators,
          and <CustomLink to="/codebase/kubos-builder">kubos-builder</CustomLink> uses it to cross-compile our Rust code for the OBC.</p>

        <TutorialNote>
          As of this writing the flake lives on the <code>nix</code> branch of docker-kubos. <code>main</code> still has the old <code>Dockerfile</code>, which
          no longer describes the published image.
        </TutorialNote>

        <h2>What's in the image</h2>
        <ul>
          <li><b>KubOS source</b> - <a href="https://github.com/UMD-THEIA/TurtleOS" target="_blank" rel="noreferrer">TurtleOS</a>, our fork of KubOS, at <code>/home/kubos/.kubos/kubos</code></li>
          <li><b>Prebuilt KubOS services and clients</b> - 8 Rust crates (app, monitor, telemetry, scheduler and local-comms services; file, shell and uart-comms clients)
            built for x86_64 so they can run inside the container</li>
          <li><b>KubOS Python libraries</b> - Python 3.13 with <code>kubos</code>, <code>kubos-app-api</code>, <code>kubos-service</code> and the old GraphQL 2 / Graphene 2 packages they need</li>
          <li><b>NOS Engine</b> - the C++ simulation runtime used with the NOS simulator, plus the old libraries it was compiled against</li>
          <li><b>ARM cross-compile tools</b> - Rust 1.80.0 with the <code>arm-unknown-linux-gnueabihf</code> target, an ARM GCC linker, and ARM <code>libudev</code></li>
        </ul>
        <p>The container runs as user <code>kubos</code> (uid 1000, in the <code>dialout</code> group for serial access) with passwordless <code>sudo</code>,
          starting in <code>/home/kubos</code>.</p>

        <h2 id="build">Building the image</h2>
        <h3>Locally</h3>
        <p>You need Nix with flakes enabled, on an x86_64 Linux machine (the flake only targets <code>x86_64-linux</code>). You do <b>not</b> need to do this to use
          the image; most people just pull it from GHCR (see the <CustomLink to="/setup">setup guides</CustomLink>).</p>
        <CodeBlock language="bash" code={buildLocal} />
        <p>Once the Nix store has the dependencies, the build takes about a minute. The local image is named <code>kubos-container:latest</code>. The docker-kubos README
          says <code>docker-kubos:latest</code>, but that name is out of date.</p>

        <h3>Releasing to GHCR</h3>
        <p>Published images are built by the GitHub workflow <code>.github/workflows/build-release.yml</code>, which runs on any tag starting with <code>v</code>.
          Pick the next version number and push a tag:</p>
        <CodeBlock language="bash" code={release} />
        <p>The workflow takes about 20 minutes. It:</p>
        <ol>
          <li>runs <code>nix flake check</code></li>
          <li>runs <code>nix build .#docker</code></li>
          <li>pushes the tarball to <code>ghcr.io/umd-theia/docker-kubos:&lt;tag&gt;</code> with <code>skopeo</code> (no <code>docker load</code> needed)</li>
          <li>attaches the tarball to a GitHub prerelease</li>
        </ol>
        <p>The current release is <code>v0.3.7</code>, built from commit <code>17dd2ab</code> (March 2nd, 2026).</p>
        <p>The image tag is whatever ref the workflow ran on, so always release by pushing a new tag. Running the workflow by hand from a branch pushes an image
          named after the branch (e.g. <code>docker-kubos:nix</code>), and re-running it on an existing tag replaces that tag with a different image.</p>
        <TutorialNote>
          Publishing a new tag does not update anything that uses the image. kubos-builder pins the image tag in its <code>compose.yml</code>, so bump it there
          or the new image never reaches OBC builds.
        </TutorialNote>

        <h2 id="flake">How the flake is organized</h2>
        <p>Both inputs are pinned in <code>flake.lock</code>, so a clean checkout builds the same image on any machine:</p>
        <CodeBlock language="nix" code={inputs} />
        <p>The flake has no overlays of its own and doesn't use <code>callPackage</code>. Each part lives in a file under <code>nix/</code> that is a plain
          function, imported with its arguments written out, so you can always see what a part depends on by looking at where it's imported.</p>
        <table className="docTable">
          <thead>
            <tr><th>File</th><th>What it builds</th></tr>
          </thead>
          <tbody>
            <tr><td><code>nix/sources/turtle.nix</code></td><td>Fetches TurtleOS from GitHub at ref <code>original</code>, pinned by hash</td></tr>
            <tr><td><code>nix/packages/kubos-rust.nix</code></td><td>The 8 KubOS crates, built from the one TurtleOS workspace with Rust 1.80</td></tr>
            <tr><td><code>nix/packages/kubos-python.nix</code></td><td>Python 3.13 with the KubOS libraries; the old GraphQL sdists come from <code>necessary-files/Pypi/</code></td></tr>
            <tr><td><code>nix/packages/nos.nix</code></td><td>NOS Engine, ITC Common, ICU 55, Boost 1.58 and Xerces 3.1, repackaged from the <code>.deb</code> files in <code>necessary-files/</code></td></tr>
            <tr><td><code>nix/packages/toolchains.nix</code></td><td>KubOS's Buildroot GCC toolchains for the BeagleBone Black and iOBC, downloaded from S3</td></tr>
            <tr><td><code>nix/lib/mkDeb.nix</code>, <code>debLibs.nix</code></td><td>Helpers that unpack a <code>.deb</code> and fix up its library paths with <code>autoPatchelfHook</code></td></tr>
            <tr><td><code>nix/checks/</code></td><td>The smoke tests run by <code>nix flake check</code></td></tr>
          </tbody>
        </table>

        <h3>Rust</h3>
        <p>Rust is pinned to 1.80.0 through <a href="https://github.com/oxalica/rust-overlay" target="_blank" rel="noreferrer">rust-overlay</a>. Newer versions break
          KubOS's dependencies; TurtleOS pins every crate in its <code>Cargo.lock</code> so the whole workspace builds on 1.80.</p>
        <CodeBlock language="nix" code={rustToolchain} />
        <p>The prebuilt KubOS binaries are on <code>PATH</code>, so you can run e.g. <code>kubos-file-client</code> directly. They are also copied
          into <code>~/.kubos/kubos/target/debug/</code>, the same place a local <code>cargo build</code> of the workspace would put them. They are actually release
          builds despite the folder name.</p>

        <h3>NOS Engine</h3>
        <p>NOS Engine only ships as Ubuntu 16.04-era <code>.deb</code> files that need ICU 55, Boost 1.58 and Xerces 3.1, versions no current distro has. The old
          Dockerfile worked around this by installing newer Boost and Xerces from apt and symlinking <code>libxerces-c-3.2.so</code> to <code>3.1</code>. The flake instead
          checks in the original <code>.deb</code>s, unpacks them, and rewrites their library paths so they find each other. The <code>nos-engine</code> check proves
          this works by loading the library with <code>LD_LIBRARY_PATH</code> unset.</p>

        <h3>Cross-compiling for ARM</h3>
        <p>The image sets these environment variables so that <code>cargo build --target arm-unknown-linux-gnueabihf</code> works out of the box:</p>
        <CodeBlock language="nix" code={envSnippet} />
        <ul>
          <li>The linker is nixpkgs' ARM GCC 14.3 cross compiler (<code>pkgsCross.armv7l-hf-multiplatform</code>), <b>not</b> the KubOS Buildroot toolchain, even
            though the Buildroot toolchain is also installed and first on <code>PATH</code>. This matters for the board; see
            the <CustomLink to="/codebase/kubos-builder">kubos-builder</CustomLink> page.</li>
          <li>The serial-port crates need ARM <code>libudev</code>. The <code>PKG_CONFIG_*</code> and <code>RUSTFLAGS</code> lines point the build at it.</li>
        </ul>

        <h3>Image assembly</h3>
        <p>The image is made with <code>dockerTools.buildLayeredImage</code> on top of <code>ubuntu:25.04</code>, which is pinned by digest. Every Nix package gets its own
          layer. After the packages are added, the build:</p>
        <ul>
          <li>writes <code>/etc/passwd</code> and <code>/etc/group</code> with the <code>kubos</code> user</li>
          <li>installs a copy of <code>sudo</code> built without PAM (so it works in a minimal image) as setuid root, with a <code>NOPASSWD</code> rule for <code>kubos</code></li>
          <li>copies TurtleOS and the prebuilt binaries into <code>~/.kubos/kubos</code></li>
          <li>replaces <code>127.0.0.1</code> with <code>0.0.0.0</code> in <code>tools/local_config.toml</code> so GraphQL services can be reached from outside the container</li>
        </ul>

        <h3>Checks</h3>
        <p><code>nix flake check</code> runs three tests:</p>
        <ul>
          <li><code>nos-engine</code> - loads the NOS Engine library to prove its dependencies resolve</li>
          <li><code>armEudevPkgConfig</code> - makes sure ARM <code>libudev.pc</code> is where <code>PKG_CONFIG_PATH</code> expects it</li>
          <li><code>toolchains</code> - makes sure the iOBC and BBB toolchains don't have clashing binary names</li>
        </ul>
        <p>None of these cross-compiles a real project, so a broken ARM build only shows up when kubos-builder runs.</p>

        <h3>Dev shell</h3>
        <p><code>nix develop</code> gives you a shell with the same packages as the image, but <b>without</b> the environment variables above. ARM builds that work in the
          container won't work in the dev shell unless you set them yourself.</p>

        <h2>What changed from the old Dockerfile</h2>
        <table className="docTable">
          <thead>
            <tr><th></th><th>Old Dockerfile</th><th>Nix flake</th></tr>
          </thead>
          <tbody>
            <tr><td>Base</td><td><code>FROM ubuntu:25.04</code></td><td><code>ubuntu:25.04</code> pinned by digest, plus Nix layers</td></tr>
            <tr><td>Packages</td><td><code>apt-get install</code></td><td>Nix packages, pinned by <code>flake.lock</code></td></tr>
            <tr><td>KubOS source</td><td>Shallow clone of upstream KubOS</td><td>TurtleOS, pinned by hash</td></tr>
            <tr><td>Rust</td><td><code>rustup</code> 1.80.0, armhf + armv5te targets</td><td>rust-overlay 1.80.0, armhf target only</td></tr>
            <tr><td>NOS Engine libs</td><td>Newer apt Boost/Xerces + symlink</td><td>The original library versions, repackaged and tested</td></tr>
            <tr><td>ARM linker</td><td>KubOS Buildroot GCC 7.4 (via <code>config.toml</code>)</td><td>nixpkgs GCC 14.3 (via environment variable)</td></tr>
            <tr><td><code>cargo-kubos</code></td><td>Installed</td><td>Not installed</td></tr>
            <tr><td>Image registry</td><td>Docker Hub <code>umdtheia/kubos</code></td><td>GHCR <code>ghcr.io/umd-theia/docker-kubos</code></td></tr>
          </tbody>
        </table>

        <h2 id="compose">Changes to docker-compose.yaml</h2>
        <p>The compose file works the same way as before (see the <CustomLink to="/codebase/docker-kubos">full walkthrough</CustomLink>), with two changes to the
          <code>kubos</code> service:</p>
        <ul>
          <li><code>image: kubos-container:latest</code> - this is the <i>local</i> name of the flake's image. Either build it yourself (above), or pull the published
            image and give it that name:</li>
        </ul>
        <CodeBlock language="bash" code={retag} />
        <ul>
          <li><code>- /dev/log:/dev/log</code> - a new volume that passes the host's syslog socket into the container, so log messages from KubOS services reach the host.</li>
        </ul>
      </div>
    </>
  );
}
