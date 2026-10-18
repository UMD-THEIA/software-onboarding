import "../../App.css";
import "./codebase.css";
import CodeBlock from "../../CodeBlock.js";
import TutorialNote from "../tutorials/TutorialNote.js";
import { Link } from "react-router-dom";

export default function KubosBuilder() {
  function CustomLink({ to, children, ...props }) {
    return (
      <Link to={to} {...props}>
        {children}
      </Link>
    );
  }

  const quickstart = `git clone --recurse-submodules git@github.com:UMD-THEIA/kubos-builder.git
cd kubos-builder
docker login ghcr.io                  # username + classic PAT with read:packages
docker compose pull
PROJECT_PATH=i2c docker compose up    # omit PROJECT_PATH to build uart`;

  const successOutput = `Architecture is x86_64
   Compiling i2c v0.1.0 (/home/kubos/rust-tools/i2c)
...
Patching File...
Copying and renaming...
Success, build output copied to: ./build-output/i2c_20260224_162213`;

  const compose = `services:
  kubos:
    container_name: kubos-builder
    image: ghcr.io/umd-theia/docker-kubos:v0.3.7
    environment:
      PROJECT_PATH: "\${PROJECT_PATH:-uart}"
    platform: linux/amd64
    working_dir: /home/kubos
    volumes:
      - ./build.sh:/home/kubos/build.sh:rw
      - ./kubos-rust-tools/:/home/kubos/rust-tools:rw
      - ./kubos-service:/home/kubos/kubos-service/:rw
      - ./build-output:/home/kubos/build-output/:rw
    command: ["/bin/bash", "./build.sh"]`;

  const cargoBuild = `cargo build --manifest-path rust-tools/$PROJECT_NAME/Cargo.toml --target arm-unknown-linux-gnueabihf --release`;

  const patchelf = `patchelf --set-interpreter /lib/ld-linux-armhf.so.3 --set-rpath /lib:/usr/lib rust-tools/$PROJECT_NAME/target/arm-unknown-linux-gnueabihf/release/$PROJECT_NAME`;

  const cargoDeps = `[dependencies]
rust-i2c = { path = "/home/kubos/.kubos/kubos/hal/rust-hal/rust-i2c" }
kubos-service = { path = "/home/kubos/kubos-service" }`;

  const release = `git tag v1.2.3-I2C
git push origin v1.2.3-I2C`;

  const inspect = `readelf -l <bin> | grep interpreter   # loader path, should be /lib/ld-linux-armhf.so.3
readelf -V <bin> | grep GLIBC_        # glibc versions the binary needs
readelf -p .comment <bin>             # which GCC linked it
readelf -d <bin> | grep RUNPATH       # should be /lib:/usr/lib`;

  return (
    <>
      <div className="leftText">
        <h1>
          <a href="https://github.com/UMD-THEIA/kubos-builder" target="_blank" rel="noreferrer">
            kubos-builder
          </a>
        </h1>
        <h3 className="lastUpdate">Last updated October 18th, 2026</h3>

        <p>
          <code>kubos-builder</code> cross-compiles one of our Rust projects for the OBC (the BeagleBone Black on the MBM2). It runs <code>cargo build</code> inside the{" "}
          <CustomLink to="/codebase/nix-docker-kubos">docker-kubos image</CustomLink> and produces a single 32-bit ARM (armhf) Linux executable you can copy to the board.
          Because everything happens in the container, it works the same on Windows, macOS (including M-series Macs) and Linux.
        </p>

        <h2>Quick start</h2>
        <p>
          You need Docker and access to the UMD-THEIA GHCR packages (see the <CustomLink to="/setup">setup guides</CustomLink> for logging in to GHCR).
        </p>
        <CodeBlock language="bash" code={quickstart} />
        <p>A successful run ends like this:</p>
        <CodeBlock language="bash" code={successOutput} />
        <p>
          The binary is in <code>build-output/</code>, named <code>&lt;project&gt;_&lt;YYYYMMDD&gt;_&lt;HHMMSS&gt;</code> (UTC). Each run adds one new file; old ones are never
          deleted.
        </p>
        <TutorialNote>
          The readme in kubos-builder tells you to edit the default project in <code>compose.yml</code>. You don't need to: setting <code>PROJECT_PATH</code> on the command
          line, as above, overrides it.
        </TutorialNote>

        <h2>What's in the repo</h2>
        <table className="docTable">
          <thead>
            <tr>
              <th>Path</th>
              <th>What it is</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>compose.yml</code>
              </td>
              <td>
                Picks the image, the project and the mounts, then runs <code>build.sh</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>build.sh</code>
              </td>
              <td>Runs inside the container: checks the project, compiles it, patches it, copies it out</td>
            </tr>
            <tr>
              <td>
                <code>kubos-rust-tools/</code>
              </td>
              <td>
                Submodule with our flight software projects, one Cargo project per folder: <code>gps-service</code>, <code>i2c</code>, <code>spi</code>, <code>ssh</code>,{" "}
                <code>uart</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>kubos-service/</code>
              </td>
              <td>
                Submodule with our modified copy of the <code>kubos-service</code> library (used by <code>gps-service</code>)
              </td>
            </tr>
            <tr>
              <td>
                <code>build-output/</code>
              </td>
              <td>Where finished binaries go (gitignored)</td>
            </tr>
            <tr>
              <td>
                <code>Dockerfile</code>, <code>config.toml</code>
              </td>
              <td>Leftovers from the old apt-based image. Not used by the build, and they don't describe the image that is actually used</td>
            </tr>
          </tbody>
        </table>

        <h2 id="compose">compose.yml</h2>
        <CodeBlock language="yaml" code={compose} />
        <ul>
          <li>
            <code>image</code> - the toolchain image, pinned to a release tag. When a new docker-kubos image is released, this line has to be bumped by hand.
          </li>
          <li>
            <code>PROJECT_PATH</code> - which folder of <code>kubos-rust-tools</code> to build. Defaults to <code>uart</code>.
          </li>
          <li>
            <code>platform: linux/amd64</code> - the image is x86_64 only. On ARM hosts like M-series Macs, Docker emulates x86_64, which is slower but works.
          </li>
          <li>
            <code>volumes</code> - all four mounts are read-write. Cargo's <code>target/</code> folder ends up on your machine inside each project folder, so later builds are
            incremental and much faster.
          </li>
        </ul>

        <h2 id="build-sh">build.sh, step by step</h2>
        <p>
          The container starts in <code>/home/kubos</code> as user <code>kubos</code> and runs <code>build.sh</code>:
        </p>
        <ol>
          <li>
            <b>Architecture check.</b> Prints whether the machine is x86_64. It only warns and never stops the build (and under emulation it always says x86_64).
          </li>
          <li>
            <b>Project check.</b> Exits if <code>PROJECT_PATH</code> is empty or <code>rust-tools/$PROJECT_PATH</code> doesn't exist.
          </li>
          <li>
            <b>Permissions.</b> Runs <code>sudo chmod -R 777</code> on the project folder so the container user can write <code>target/</code> on your mounted folder.
          </li>
          <li>
            <b>Compile.</b>
            <CodeBlock language="bash" code={cargoBuild} />
            This uses rustc 1.80.0 and links with the ARM linker the image sets in <code>CARGO_TARGET_ARM_UNKNOWN_LINUX_GNUEABIHF_LINKER</code>. If it fails, the script prints
            a red <code>Error, build process failed</code> and nothing is copied.
          </li>
          <li>
            <b>Patch.</b>
            <CodeBlock language="bash" code={patchelf} />
            The image's linker comes from Nix, so the binary it produces looks for its loader at a <code>/nix/store/...</code> path that doesn't exist on the board.
            <code>patchelf</code> points it at the board's loader instead and tells it to find libraries in <code>/lib</code> and <code>/usr/lib</code>.
          </li>
          <li>
            <b>Copy out.</b> Copies the binary to <code>build-output/&lt;project&gt;_&lt;timestamp&gt;</code> and prints a green <code>Success</code>.
          </li>
        </ol>

        <h2>Adding a new project</h2>
        <ul>
          <li>
            Create a folder in <code>kubos-rust-tools</code>. The{" "}
            <b>
              package name in <code>Cargo.toml</code> must match the folder name
            </b>
            , because <code>build.sh</code>
            looks for a binary with the folder's name.
          </li>
          <li>KubOS crates are referenced with absolute paths that only exist inside the image:</li>
        </ul>
        <CodeBlock language="toml" code={cargoDeps} />
        <p>
          Because of this, <code>cargo check</code> and rust-analyzer on your own machine will fail to resolve those dependencies. Build through kubos-builder, or open the
          project inside the container.
        </p>

        <h2 id="releases">Releases</h2>
        <p>
          Release binaries are built by GitHub workflows in <code>kubos-rust-tools</code> (<code>build-uart.yaml</code>, <code>build-i2c.yaml</code>,{" "}
          <code>build-spi.yaml</code>). Pushing a tag like this triggers the matching one:
        </p>
        <CodeBlock language="bash" code={release} />
        <p>
          The workflow checks out kubos-builder with its submodules, pulls the image, runs <code>PROJECT_PATH=i2c docker compose up</code>, and uploads
          <code>build-output/*</code> to a GitHub prerelease.
        </p>
        <table className="docTable">
          <thead>
            <tr>
              <th>Pin</th>
              <th>Where</th>
              <th>Current</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Toolchain image</td>
              <td>
                kubos-builder <code>compose.yml</code>
              </td>
              <td>
                <code>docker-kubos:v0.3.7</code>
              </td>
            </tr>
            <tr>
              <td>Project source</td>
              <td>
                kubos-builder's <code>kubos-rust-tools</code> submodule
              </td>
              <td>
                <code>35083b9</code> (<code>v0.2.2-UART</code>)
              </td>
            </tr>
            <tr>
              <td>KubOS source</td>
              <td>
                docker-kubos <code>nix/sources/turtle.nix</code>
              </td>
              <td>
                TurtleOS ref <code>original</code> + hash
              </td>
            </tr>
          </tbody>
        </table>

        <h2 id="board">Running the binary on the board</h2>
        <p>
          The output is a dynamically linked 32-bit ARM executable. Copy it to the board, <code>chmod +x</code> it, and run it.
        </p>
      </div>
    </>
  );
}
