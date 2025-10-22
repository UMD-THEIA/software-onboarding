import '../../App.css'
import './codebase.css'
import CodeBlock from "../../CodeBlock.js"
import { Link } from "react-router-dom"



export default function DockerKubos() {


  function CustomLink({ to, children, ...props }) {
    return (
      <Link to={to} {...props}>
        {children}
      </Link>
    )
  }

  const step7 = `COPY necessary-files/itc-common-cxx11-modified.deb itc-common-cxx11-modified.deb
RUN dpkg -i itc-common-cxx11-modified.deb && rm itc-common-cxx11-modified.deb

COPY necessary-files/nos-engine-cxx11-Release_1.4.0_amd64.deb nos-engine-cxx11-Release_1.4.0_amd64.deb
RUN dpkg -i nos-engine-cxx11-Release_1.4.0_amd64.deb && rm nos-engine-cxx11-Release_1.4.0_amd64.deb`

  const step8 = `RUN useradd --create-home --shell /bin/bash kubos
RUN adduser kubos sudo
RUN adduser kubos dialout
RUN echo 'kubos:kubos' | chpasswd
RUN echo "kubos ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers`

  const step9 = `USER kubos
WORKDIR /home/kubos

RUN git clone https://github.com/kubos/kubos /home/kubos/.kubos/kubos --depth 1
RUN chown -R kubos /home/kubos/.kubos`

  const step10_1 = `ENV PATH="$PATH:/home/kubos/.cargo/bin"
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
RUN rustup default 1.80.0 && rm -rf /home/kubos/.rustup/toolchains/*/share/doc
RUN rustup target install arm-unknown-linux-gnueabihf
RUN rustup target install armv5te-unknown-linux-gnueabi
RUN rustup component add clippy
RUN rustup component add rustfmt`
  const step10_2 = `RUN /home/kubos/.cargo/bin/cargo install --git https://github.com/kubos/cargo-kubos
RUN /home/kubos/.cargo/bin/cargo install --bin kubos-file-client --path /home/kubos/.kubos/kubos/clients/kubos-file-client/
RUN /home/kubos/.cargo/bin/cargo install --bin kubos-shell-client --path /home/kubos/.kubos/kubos/clients/kubos-shell-client/
RUN /home/kubos/.cargo/bin/cargo install --bin uart-comms-client --path /home/kubos/.kubos/kubos/clients/uart-comms-client/`

  const step11 = `RUN cd .kubos/kubos && cargo build --bin kubos-app-service
RUN cd .kubos/kubos && cargo build --bin monitor-service
RUN cd .kubos/kubos && cargo build --bin telemetry-service
RUN cd .kubos/kubos && cargo build --bin scheduler-service`

  const dockerrunkubos = `docker run -d --name kubos --network=wires \\
  -p 8110:8110 -p 8120:8120 -p 8130:8130 -p 8140:8140 \\
  -v $(pwd)/flight-software:/home/kubos/flight-software:rw \\
  -v $(pwd)/logs:/home/kubos/logs:rw \\
  -e LOCAL_CONFIG=/home/kubos/.kubos/kubos/tools/local_config.toml \\
  --entrypoint "/bin/bash" umdtheia/kubos:v0.2.3 /home/kubos/flight-software/setup.sh`;

  const dockerrunsimulators = `docker run -d --name adcs --network=wires adcs-simulator
docker run -d --name payload --network=wires payload-simulator
docker run -d --name gps --network=wires gps-simulator
docker run -d --name pdu --network=wires pdu-simulator`;

  const compose1 = `services:
  kubos:
    container_name: kubos
    # build:
    #  dockerfile: Dockerfile
    image: umdtheia/kubos:v0.2.3
    working_dir: /home/kubos`;
  const compose1_2 = `services:
    kubos:
      container_name: kubos
      build:
       dockerfile: Dockerfile
      # image: umdtheia/kubos:v0.2.3
      working_dir: /home/kubos`;
  const compose2 = `  payload:
    container_name: payload
    build:
      context: ./hardware-simulators/event-camera/
      dockerfile: Dockerfile
    image: payload-simulator
    networks:
      - wires`;
    
    const compose3 = `- "8000:8000" # app-service
- "8010:8010" # scheduler-service
- "8020:8020" # telemetry-service
- "8030:8030" # monitor-service
- "8110:8110" # gps-service
- "8120:8120" # pdu-service
- "8130:8130" # payload-service
- "8140:8140" # adcs-service`;

  return (
    <>
      <div className="leftText">
        <h1><a href="https://github.com/UMD-THEIA/docker-kubos" target="_blank" rel="noreferrer">docker-kubos</a></h1>
        <h3 className="lastUpdate">Last updated March 20th, 2025</h3>
        {/* <h2>Contents</h2>
        <ol>
          <li>Dockerfile</li>
          <li>Docker Compose</li>
        </ol> */}

        <h2 id="dockerfile"><a href="https://github.com/UMD-THEIA/docker-kubos/blob/main/Dockerfile" target="_blank" rel="noreferrer">Dockerfile</a></h2>
        <p>I will run through the <code>Dockerfile</code> (which includes necessary-files) and the <code>docker-compose.yaml</code> file.</p>

        <h3>1. Setting Up the Base Image</h3>
        <p>As with all Dockerfiles, first specify a base image:</p>
        <CodeBlock language="dockerfile" code={`FROM ubuntu:25.04`} />
        <p>This utilizes a recent version of Ubuntu as the base image. This was recently changed from 20.04 which had dropped support.
          This caused some package compatability issues. In the future, it is entirely possible that it won't be possible to install python3.7
          from apt any more and we will need to find a way around this.</p>
        <h3>2. Installing Essential Dependencies</h3>
        <p>Before installing software, the apt package manager needs to update its package lists.</p>
        <CodeBlock language="dockerfile" code={`ARG DEBIAN_FRONTEND=noninteractive\nRUN echo "Install dependencies"\nRUN apt-get update -y`} />
        <ul>
          <li>The <code>DEBIAN_FRONTEND=noninteractive</code> argument prevents the system from prompting for user input during installations.</li>
          <li><code>apt-get update -y</code> ensures that the package lists are current.</li>
        </ul>
        <p>Then, install the various dependencies needed for development:</p>
        <CodeBlock language="dockerfile" code={`RUN apt-get upgrade --no-install-recommends -y python3.7\nRUN apt-get install --no-install-recommends -y pkg-config build-essential git cmake unzip wget sqlite3 libsqlite3-dev libssl-dev curl ssh net-tools`} />
        <p>This installs Python 3.7 and essential development tools like <code>git</code>, <code>cmake</code>, <code>sqlite3</code>, and <code>openssl</code></p>
        <h3>3. Installing Additional System Utilities</h3>
        <p>The next few lines install system tools for compiling and managing software and for generating documentation (not entirely certain whatfor)</p>
        <CodeBlock language="dockerfile" code={`RUN apt-get install --no-install-recommends -y file rsync bc cpio ncurses-dev libc6-i386 lib32stdc++6 lib32z1\nRUN apt-get install --no-install-recommends -y doxygen graphviz plantuml`} />
        <h3>4. Installing Python Tools</h3>
        <p>Installs <code>pip</code>, <code>setuptools</code> and <code>venv</code> for managing python packages</p>
        <CodeBlock language="dockerfile" code={`RUN apt-get install --no-install-recommends -y python3-pip python3-setuptools python3-venv\nRUN apt-get install python3-wheel`} />
        <h3>5. Setting Up Kubos Linux Toolchain</h3>
        <p>Downloads and extracts the required cross-compilation toolchains for iOBC and BBB (BeagleBone Black):</p>
        <CodeBlock language="dockerfile" code={`RUN wget https://s3.amazonaws.com/kubos-world-readable-assets/iobc_toolchain.tar.gz && tar -xf ./iobc_toolchain.tar.gz -C /usr/bin && rm ./iobc_toolchain.tar.gz\nRUN wget https://s3.amazonaws.com/kubos-world-readable-assets/bbb_toolchain.tar.gz && tar -xf ./bbb_toolchain.tar.gz -C /usr/bin && rm ./bbb_toolchain.tar.gz`} />
        <h3>6. Installing NOS3 Dependencies</h3>
        <CodeBlock language="dockerfile" code={`RUN apt-get --no-install-recommends install -y software-properties-common\nRUN add-apt-repository 'deb http://us.archive.ubuntu.com/ubuntu xenial main universe'\nRUN apt-get install -y libboost-system1.83.0 libboost-program-options1.83.0 libxerces-c3.2t`} />
        <ul>
          <li>Adds the Ubuntu Xenial repository (needed for some dependencies).</li>
          <li>Installs <code>boost</code> and <code>xerces-c</code>, which are required for NOS3 (NASA Operational Simulator 3).</li>
        </ul>
        <h3>7. Installing Additional Required Packages</h3>
        <p>First, due to compatability reasons, we have to provide packages a way to access <code>libxerces-c-3.1.so</code> even though apt only has <code>libxerces-c-3.2.so</code></p>
        <CodeBlock language="dockerfile" code={`RUN ln /usr/lib/x86_64-linux-gnu/libxerces-c-3.2.so /usr/lib/x86_64-linux-gnu/libxerces-c-3.1.so`} />
        <p>Then, we install specific releases of <code>itc-common</code> and <code>nos-engine</code> that are installed with KubOS.</p>
        <CodeBlock language="dockerfile" code={step7} />
        <p>We copy over the pre-compiled binaries which are stored in necessary-files and install with with <code>dpkg</code>. Both of these require
          <code>libxerces-c-3.1.so</code> which is why the above step is necessary.</p>
        <h3>8. Setting Up the Kubos User</h3>
        <p>To prevent running everything as <code>root</code>, a new user is created.</p>
        <CodeBlock language="dockerfile" code={step8} />
        <ul>
          <li>Creates a user called kubos.</li>
          <li>Grants it sudo privileges and password-less access.</li>
        </ul>
        <h3>9. Cloning the Kubos Repository</h3>
        <CodeBlock language="dockerfile" code={step9} />
        <ul>
          <li>Clones the <a href="https://github.com/kubos/kubos" target="_blank" rel="noreferrer">Kubos repository</a> into <code>/home/kubos/.kubos/kubos</code>.</li>
          <li><code>--depth 1</code> ensures that only the latest commit is cloned.</li>
        </ul>
        <h3>10. Installing Rust Toolchain</h3>
        <CodeBlock language="dockerfile" code={step10_1} />
        <ul>
          <li>Installs Rust 1.80.0 (anything later starts causing issues with KubOS)</li>
          <li>Adds cross-compilation targets for embedded systems.</li>
        </ul>
        <p>The following lines install Kubos-specific Rust utilities:</p>
        <CodeBlock language="dockerfile" code={step10_2} />
        <h3>11. Compiling and Configuring Kubos Services</h3>
        <p>Build the code Kubos services (so they don't have to be compiled when you start the container)</p>
        <CodeBlock language="dockerfile" code={step11} />
        <p>Finally, the configuration is updated which replaces 127.0.0.1 with 0.0.0.0 to allow external connections in GraphQL:</p>
        <CodeBlock language="dockerfile" code={`RUN sed -i 's/127.0.0.1/0.0.0.0/g' "/home/kubos/.kubos/kubos/tools/local_config.toml"`} />
        <h2 id="compose"><a href="https://github.com/UMD-THEIA/docker-kubos/blob/main/docker-compose.yaml" target="_blank" rel="noreferrer">docker-compose.yaml</a></h2>
        <p>This <code>docker-compose.yml</code> file defines a multi-container setup for Kubos flight software and various
          hardware simulators. It simplifies running the system by managing dependencies, networks, and configurations.</p>
        <h3>1. Defining the kubos Service</h3>
        <p>The Kubos container acts as the central node, running the flight software and managing communications.</p>
        <CodeBlock language="yaml" code={compose1} />
        <ul>
          <li><code>container_name: kubos</code> - Names the container as <code>kubos</code>.</li>
          <li><code>image: umdtheia/kubos:v0.2.3</code> - Uses the pre-built Kubos v0.2.3 image from DockerHub (built and uploaded with Github Actions)</li>
          <li><code>working_dir: /home/kubos</code> - Sets the working directory inside the container.</li>
        </ul>
        <p>If you want to build from your local <code>Dockerfile</code> instead of pulling from Dockerhub (only recommended on Linux),
          do the following instead:</p>
        <CodeBlock language="yaml" code={compose1_2} />

        <h3>2. Exposing Ports for Kubos Services</h3>

        <CodeBlock language="yaml" code={compose3} />
        <p>This maps ports from the container to the host machine, allowing GraphQL to be accessible from your host computer, outside of the container.</p>
        <p>These ports correspond to different Kubos services: </p>
{/* 
    - "8000:8000" # app-service
      - "8010:8010" # scheduler-service
      - "8020:8020" # telemetry-service
      - "8030:8030" # monitor-service
      - "8110:8110" # gps-service
      - "8120:8120" # pdu-service
      - "8130:8130" # payload-service
      - "8140:8140" # adcs-service */}
        
        <ul>
          <li><code>8010</code> -&gt; App Service. Accessible from <u>http://localhost:8010/graphiql</u> when running.</li>
          <li><code>8020</code> -&gt; Telemetry Service. Accessible from <u>http://localhost:8020/graphiql</u> when running.</li>
          <li style={{ marginBottom: "15px" }}><code>8030</code> -&gt; Monitor Service. Accessible from <u>http://localhost:8030/graphiql</u> when running.</li>

          <li><code>8110</code> -&gt; GPS Service. Accessible from <u>http://localhost:8110/graphiql</u> when running.</li>
          <li><code>8120</code> -&gt; PDU Service. Accessible from <u>http://localhost:8120/graphiql</u> when running.</li>
          <li><code>8130</code> -&gt; Payload Service. Accessible from <u>http://localhost:8130/graphiql</u> when running.</li>
          <li><code>8140</code> -&gt; ADCS Service. Accessible from <u>http://localhost:8140/graphiql</u> when running.</li>
        </ul>
        <h3>3. Mounting Volumes for Persistent Storage</h3>
        <CodeBlock language="yaml" code={`    volumes:\n      - ./flight-software:/home/kubos/flight-software:rw\n      - ./logs:/home/kubos/logs:rw # mount logs directory`} />
        <p>Binds flight-software in the current directory to <code>/home/kubos/fight-software</code> in the container with rw (read/write) permissions.</p>
        <p>Binds logs in the current directory to <code>/home/kubos/logs</code> in the container with rw (read/write) permissions.</p>
        <h3>4. Running a Custom Startup Script</h3>
        <CodeBlock language="yaml" code={`    entrypoint: ["/bin/bash", "/home/kubos/flight-software/setup.sh"]`} />
        <p>When the container starts, it runs the <code>setup.sh</code> script inside flight-software (this script will be covered in the <CustomLink to="/codebase/flight-software">flight-software</CustomLink> section).</p>
        <h3>5. Interactive Shell and Environment Variables</h3>
        <CodeBlock language="yaml" code={`    stdin_open: true\n    tty: true\n    environment:\n      - LOCAL_CONFIG=/home/kubos/.kubos/kubos/tools/local_config.toml`} />
        <p><code>stdin_open: true</code> and <code>tty: true</code> allow interactive usage (e.g., running bash inside the container).</p>
        <p>The <code>LOCAL_CONFIG</code> environment variable tells the setup script where to find the configuration file when starting up GraphQL</p>
        <h3>6. Defining Hardware Simulator Containers</h3>
        <p>All these containers share a similar structure so instead of looking at each one, we will only look at the Payload Simulator.</p>
        <CodeBlock language="yaml" code={compose2} />
        <ul>
          <li><code>container_name: payload</code> - sets the container name to payload so it can be found easily with <code>docker ps</code> or <code>docker exec</code></li>
          <li>The build section tells the compose file that the Dockerfile can be found in <code>./hardware-simulators/event-camera/</code>.</li>
          <li><code>image: payload-simulator</code> - sets the image name so that it can easily be found when rerunning <code>docker compose up</code> instead of rebuilding the image again</li>
          <li><code>networks: - wires</code> - sets the container to use the <code>wires</code> network to communicate with other containers</li>
        </ul>
        <h3>7. Creating a Shared Network</h3>
        <p>We define a shared network explicitly (<code>wires</code>) so that all the containers in the compose file can communicate with each other.
          This attempts to mimic how the actual satellite would work in communicating with components (of course here we use HTTP requets, on the actual
          satellite we would likely use I2C and SCPI).</p>
        <CodeBlock language="yaml" code={`networks:\n  wires:\n    driver: bridge`} />

        <h3>8. Using Without <code>docker compose</code></h3>
        <p>Before we finish, it is important to understand how the running our entire Docker system would look like without <code>Docker Compose</code>:</p>

        <p>We first have to create the shared network that all the containers use, otherwise they won't be able to communicate with each other. 
          Since all services communicate over the <code>wires</code> network, you must first create it:</p>
        <CodeBlock language="shell" code={`docker network create wires`} />
        <p>Then, we have to start the <code>kubos</code> container:</p>
        <CodeBlock language="shell" code={dockerrunkubos} />
        <p>Then, we have to start all the simulators seperately and attach them to the wires network</p>
        <CodeBlock language="shell" code={dockerrunsimulators} />

        <p>You would have to run all of these commands every single time you wanted to start up a container. Instead with docker-compose, we can
          define everything inside the <code>docker-compose.yaml</code> file and just run <code>docker compose up -d</code> and everything will be started up for us.</p>
        <p>This also streamlines the process to stop everything. With docker run, you would need to do <code>docker stop kubos adcs payload gps pdu</code> remembering to 
        stop every container yous started. Instead with compose, you can just run <code>docker compose stop</code> which will halt everything.</p>
      </div>
    </>
  );
}