import '../App.css'
import { Link } from "react-router-dom"
import CodeBlock from '../CodeBlock'


function CustomLink({ to, children, ...props }) {
  return (
    <Link to={to} {...props}>
      {children}
    </Link>
  )
}

export default function Docker() {
  const Dockerfile = `# Use the latest Ubuntu image as the base
FROM ubuntu:latest

# Update package lists and install Python3
RUN apt-get update && apt-get install -y python3

# Set the working directory inside the container
WORKDIR /app

# (Optional) Copy your application files if needed
# COPY . /app

# Expose port 80 from the container
EXPOSE 80

# Run a simple Python HTTP server on port 80
CMD ["python3", "-m", "http.server", "80"]`;

  const dockercompose = `services:
  web:
    build: .
    ports:
      - "8080:80"         # Maps host port 8080 to container port 80.
    networks:
      - app-network
    volumes:
      - ./cache:/app/cache  # Bind mount: "./cache" is a folder on your host, mounted to "/app/cache" in the container.
  
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: example
      MYSQL_DATABASE: mydb
    ports:
      - "3306:3306"
    networks:
      - app-network
    # For the database, you might want to use a dedicated Docker-managed volume,
    # but here we're focusing on local folder sharing for the web service.
    
networks:
  app-network:
    driver: bridge`;

  return (
    <>
      <h1>Docker</h1>

      <div className="leftText">
        <h2>Introduction to Docker</h2>
        <p>This is designed to be a non-specific Docker introduction. For information about our specific Docker set-up, please
          visit <CustomLink to="/codebase/docker-kubos">here</CustomLink>.</p>
        <p>This tutorial will assume that you have basic knowledge of the Linux Commandline and the apt package manager. If you lack this, please
          visit <CustomLink to="/linuxtutorial">our Linux tutorial</CustomLink>.
        </p>

        <h2>Why Docker?</h2>
        <p>Imagine this scenario</p>
        <ul>
          <li>You develop an application on your local machine, and it runs perfectly.</li>
          <li>When you hand it off to a colleague or deploy it to a server, differences in operating systems, library versions, or configurations
            suddenly break everything.</li>
        </ul>
        <p>Docker solves this "works on my machine" problem by packaging your application and its entire environment into a container.
          Containers are lightweight, share the host's kernel (unlike virtual machines), and guarantee that your app runs the same everywhere.
          This not only improves collaboration among developers but also streamlines deployment and scaling.</p>

        <p><b>Key Concepts:</b></p>
        <ul>
          <li><b>Dockerfile</b>: A blueprint that lists the steps required to build a Docker image.</li>
          <li><b>Image</b>: An immutable snapshot created from a Dockerfile. It contains everything needed to run an application.</li>
          <li><b>Container</b>: A running instance of an image. Think of it as a self-contained, isolated environment for your app.</li>
          <li><b>Port Mapping</b>: This lets you expose a port from your container to your host machine so that your app is accessible externally.</li>
        </ul>
        <h2>Creating a Basic Dockerfile with Ubuntu</h2>
        <p>Let's start with a very basic Dockerfile that builds on Ubuntu. We'll use Python3 to run a
          simple HTTP server—this will be our long-running process that keeps the container active.</p>

        <p>Create a file named <code>Dockerfile</code> in your project directory with the following contents:</p>
        <CodeBlock language="dockerfile" code={Dockerfile} />

        <p><b>What This Dockerfile Does:</b></p>
        <ul>
          <li><b>FROM ubuntu:latest:</b><br />Starts with a clean Ubuntu image as the foundation.</li>
          <li><b>RUN apt-get update && apt-get install -y python3:</b><br />Updates the package lists and installs Python3. This mirrors the idea from the videos where a specific runtime is installed so that everyone runs on the same version.</li>
          <li><b>WORKDIR /app:</b><br />Sets a working directory for any future commands. It's similar to "cd'ing" into a directory before running commands.</li>
          <li><b>EXPOSE 80:</b><br />Declares that the container will listen on port 80. Note that this is informational—it doesn't automatically publish the port to the host.</li>
          <li><b>CMD ["python3", "-m", "http.server", "80"]:</b><br /> Starts a simple HTTP server. This process is long-running, ensuring the container stays active, similar to how a Node.js app or other server processes would keep a container alive.</li>
        </ul>
        <h2>Building Your Docker Image</h2>
        <p>Now that you have a Dockerfile, build your Docker image by running this command in your terminal (from the directory containing your Dockerfile):</p>
        <CodeBlock language="shell" code={`docker build -t my-ubuntu-app .`} />
        <ul>
          <li><code>-t my-ubuntu-app</code>: Tags your image with the name <code>my-ubuntu-app</code>.</li>
          <li><code>.</code>: Tells Docker to look for the Dockerfile in the current directory.</li>
        </ul>
        <p>This command processes each instruction in the Dockerfile and builds an image that can be run on any system with Docker.</p>
        <h2>Running a Container and Exposing Ports</h2>
        <p>Once your image is built, you can run a container from it. The command below starts the
          container in the background and maps port 80 inside the container to port 8080 on your host:</p>
        <CodeBlock language="shell" code={`docker run -d -p 8080:80 --name my-running-app my-ubuntu-app`} />
        <p><b>Breaking down the command:</b></p>
        <ul>
          <li><code>-d</code>: Runs the container in detached mode (in the background).</li>
          <li><code>-p 8080:80</code>: Maps port 8080 on your local machine (host) to port 80 in the container. Now your HTTP server is accessible at <code>http://localhost:8080</code>.</li>
          <li><code>--name my-running-app</code>: Assigns a friendly name to your container.</li>
          <li><code>my-ubuntu-app</code>: The image we built earlier.</li>
        </ul>
        <h2>Accessing the Container's Environment</h2>
        <p>A powerful aspect of Docker is the ability to get an interactive shell inside a running container. This is great for troubleshooting or running commands manually. Use the following command:</p>
        <CodeBlock language="shell" code={`docker exec -it my-running-app /bin/bash`} />
        <p><b>Explanation:</b></p>
        <ul>
          <li><code>docker exec</code>: Runs a command in an already running container.</li>
          <li><code>-it</code>: Opens an interactive terminal session.</li>
          <li><code>/bin/bash</code>: Launches the Bash shell, giving you access to the container’s file system and tools.</li>
        </ul>
      </div>
      <h1>Docker Compose</h1>
      <div className="leftText">
        <h2>Understanding Docker Networks</h2>
        <p>Before understanding a key factor in why we use Docker Compose, it is essential to know about Docker Networks</p>

        <p><b>What Are Docker Networks?</b></p>
        <p> Docker networks let containers communicate with one another. When you start a container, it gets attached to a
          default network unless you specify otherwise. You can create custom networks (using <code>docker network create</code>) that
          let containers find each other via container names.</p>
        <p><b>Why Networks Matter:</b></p>
        <ul>
          <li>Isolation: Containers on different networks can be isolated from each other.</li>
          <li>Communication: Containers on the same network can refer to each other by name.</li>
        </ul>
        <p><em>Example:</em></p>
        <p> Imagine you have a web server and a database container. With Docker networks, the web server can connect to the
          database using a hostname (like <code>db</code>) instead of an IP address, greatly simplifying configuration.</p>
        <h2>Introducing Docker Compose</h2>
        <p>Docker Compose is a tool that lets you define and manage multi-container Docker applications using a YAML configuration file.
          Instead of running multiple <code>docker run</code> commands, you define your entire stack in one file. This means:</p>
        <ul>
          <li>All your services, networks, and volumes are defined in a docker-compose.yml.</li>
          <li>Use a single command (<code>docker compose up</code>) to start all services.</li>
          <li>Further ensures team member or environment uses the same configuration, reducing the "works on my machine" issues.</li>
        </ul>

        <h2>The Anatomy of a Docker Compose File</h2>

        <p>A typical docker-compose.yml file defines your services, networks, and volumes. In this example, we'll focus on the web service
          (our application) and show how to share a local folder for caching or other data.</p>

        <p>Here’s an example file:</p>
        <CodeBlock language="shell" code={dockercompose} />
        <p><b>Explanation of Key Sections:</b></p>
        <ul>
          <li><b>Services:</b>
            <ul>
              <li><code>web</code>:
                <ul>
                  <li><code>build: .</code> tells Compose to build an image from the Dockerfile in the current directory.</li>
                  <li><code>ports</code> expose container ports (80 inside the container to 8080 on the host).</li>
                  <li><code>volumes</code> attach persistent storage to the container. (see additional note below)</li>
                  <li><code>networks</code> ensure that the <code>web</code> container can communicate with <code>db</code> using the network alias provided by the service name.</li>
                </ul>
              </li>
              <li><code>db</code>:
                <ul>
                  <li>Uses a pre-built image (<code>mysql:8.0</code>) from Docker Hub.</li>
                  <li>Environment variables are used to configure MySQL.</li>
                  <li>Maps port 3306 to allow external connections (or inter-container communication on the defined network).</li>
                </ul>
              </li>
            </ul>
          </li>
          <li><b>Networks:</b><br /><code>app-network</code> is defined under networks. Containers attached to this network can communicate with each other using their service names.</li>
          <li><b>Volumes:</b><br /> In the web service, the line: <br />
            <code>volumes:<br />- ./cache:/app/cache</code><br />
            tells Docker Compose to mount the local <code>cache</code> directory (located in your current project directory) into the container
            at <code>/app/cache</code>.
            This allows your application to read from and write to that folder in real time. Any changes on the host are immediately reflected
            inside the container and vice versa.</li>
        </ul>
        <h2>Running and Managing Your Multi-Container App</h2>
        <p><b>Starting Containers</b></p>
        <p>Run all services defined in your compose file:</p>
        <CodeBlock language="shell" code={`docker compose up`} />
        <p>Adding the -d flag starts containers in detached mode (you won't see logs):</p>
        <CodeBlock language="shell" code={`docker compose up -d`} />
        <p>You can also start just one container:</p>
        <CodeBlock language="shell" code={`docker compose up -d web`} />
        <p><b>Stopping Containers</b></p>
        <p>You can run <code>docker compose stop</code> which stops the running containers but leaves the containers, networks, and volumes intact.
          You can restart them later with <code>docker compose start</code></p>
        <p><code>docker compose down</code> instead stops and removes containers, networks, and default volumes created by <code>up</code>. 
          This is useful if you want to completely tear down your application environment and start fresh later.</p>
      </div>
    </>
  )
}