import '../../App.css'
import CodeBlock from "../../CodeBlock.js"
import { Link } from "react-router-dom"
import './tutorial.css'
import TutorialNote from './TutorialNote.js'

function CustomLink({ to, children, ...props }) {
  return (
    <Link to={to} {...props}>
      {children}
    </Link>
  )
}

function ExternalLink({ to, children, ...props }) {
  return (
    <a href={to} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  )
}

const samplequery = `{
    telemetry(subsystem: "EPS") {
        timestamp,
        parameter,
        value
    }
}`

const intargparse = `import argparse
parser = argparse.ArgumentParser()

parser.add_argument('--config', '-c')

args = parser.parse_args()

if args.config is not None:
    SERVICES = app_api.Services(args.config)
else:
    SERVICES = app_api.Services()`

const parseresponse = `data = response["ping"]
if data == "pong":
    print("Successfully pinged monitor service")
else:
    print("Unexpected monitor service response: %s" % data)`

const properping = `#!/usr/bin/env python3

import argparse
import kubos_app as app_api

def main():

    parser = argparse.ArgumentParser()

    parser.add_argument('--config', '-c')

    args = parser.parse_args()

    if args.config is not None:
        SERVICES = app_api.Services(args.config)
    else:
        SERVICES = app_api.Services()

    request = '{ ping }'

    response = SERVICES.query(service="monitor-service", query=request)

    data = response["ping"]

    if data == "pong":
        print("Successfully pinged monitor service")
    else:
        print("Unexpected monitor service response: %s" % data)

if __name__ == "__main__":
    main()`

const TelDbReq = `request = '''
    mutation {
        insert(subsystem: "OBC", parameter: "status", value: "%s") {
            success,
            errors
        }
    }
    ''' % (status)`

const TelDbCheckResp = `data = response["insert"]
success = data["success"]
errors = data["errors"]

if success == False:
    print("Telemetry insert encountered errors: " + str(errors))
else:
    print("Telemetry insert completed successfully")`

const FinalTelDb = `#!/usr/bin/env python3

import argparse
import kubos_app as app_api
import sys

def main():

    parser = argparse.ArgumentParser()

    parser.add_argument('--config', '-c')

    args = parser.parse_args()

    if args.config is not None:
        SERVICES = app_api.Services(args.config)
    else:
        SERVICES = app_api.Services()

    request = '{ ping }'

    try:
        response = SERVICES.query(service="monitor-service", query=request)

        data = response["ping"]

        if data == "pong":
            print("Successfully pinged monitor service")
            status = "Okay"
        else:
            print("Unexpected monitor service response: %s" % data)
            status = "Unexpected"

    except Exception as e:
        print("Something went wrong: " + str(e))
        status = "Error"

    request = '''
        mutation {
            insert(subsystem: "OBC", parameter: "status", value: "%s") {
                success,
                errors
            }
        }
        ''' % (status)

    try:
        response = SERVICES.query(service="telemetry-service", query=request)
    except Exception as e:
        print("Something went wrong: " + str(e) )
        sys.exit(1)

    data = response["insert"]
    success = data["success"]
    errors = data["errors"]

    if success == False:
        print("Telemetry insert encountered errors: " + str(errors))
        sys.exit(1)
    else:
        print("Telemetry insert completed successfully")

if __name__ == "__main__":
    main()`


export default function FirstMissionAppTutorial() {

  return (
    <>
      <div className="leftText wiki">
        <h1><ExternalLink to="https://kubos-preservation-group.github.io/kubos/tutorials/first-mission-app.html">Creating Your First Mission Application</ExternalLink></h1>
        <h3 className="lastUpdate">Last updated September 10th, 2025</h3>
        <TutorialNote>
          <p> In general, I will rewrite most of the "Creating Your First Mission Application" tutorial here, but change it so its relevant to our docker environment.</p>
        </TutorialNote>


        <p>Mission applications are user-created programs which are used to control satellite behavior and execute mission logic.</p>
        <p>These applications are registered with the <ExternalLink to="https://kubos-preservation-group.github.io/kubos/ecosystem/services/app-service.html">applications service</ExternalLink>, which is responsible for tracking versioning and controlling application upgrades and rollbacks.</p>
        <p>This tutorial guides the user through the process of creating a basic mission application using Python3.</p>
        <p>At the end of the tutorial, the user will have a mission application which is capable of querying the monitor service for current system memory usage and then storing that data into the telemetry database.</p>
        <p>You will go through this tutorial entirely within your development environemnt in the kubos container.</p>

        <h2 className='tutorial-text'>Setup</h2>
        <TutorialNote>
          <p>All the code for this tutorial should be run inside the environment provided by the kubos docker container.</p>
          <p>Only code snippets will be provided here, for a full guide, visit the "<CustomLink to="/tutorials/docker-setup">Running docker-kubos</CustomLink>" tutorial.</p>
          <p>A basic familiarity with vscode, <CustomLink to="/git">git/github</CustomLink> and the <CustomLink to="/linuxtutorial">Linux terminal</CustomLink> is also expected.</p>
        </TutorialNote>
        <ul className='tutorial-text'>
          <li>Make sure you have the docker kubos container set up and running</li>
          <li>The container already has the KubOS source repo at: <code>/home/kubos/.kubos/kubos/</code></li>
          <li>During startup, the container has already automatically started up the <code>monitor-service</code> and <code>telemetry-service</code></li>
          <li>Now, before you start creating the mission application, you will want to open up <code>docker-kubos</code> in an ide like vscode.</li>
          <li>Then create a new branch in flight-software. I recommend something like "yourname-onboarding" (<code>git branch yourname-onboarding</code>). You will be writing your mission app in <code>flight-software</code> and then running it inside the container.</li>
          <li>Now, inside flight-software create a folder named the same as the branch. Inside create a new file for this tutorial called <code>my-mission-app.py</code>. In order to allow the applications service to run our mission application, you'll need to start by placing the following line at the top of the new file:
            <br /> <code>#!/usr/bin/env python3</code> <br />
            This allows the file to be run like a normal executable, <code>./my-mission-app.py</code>, rather than needing to explicitly call the Python interpreter with <code>python my-mission-app.py</code>.
          </li>
          <li>Since you'll be calling the file as an executable, you'll also need to update the file permissions: <code>$ chmod +x my-mission-app.py</code></li>
        </ul>

        <h2>Kubos Services and GraphQL</h2>
        <p>A major component of most mission applications will be interacting with <ExternalLink to="https://kubos-preservation-group.github.io/kubos/ecosystem/index.html#service-docs">Kubos services</ExternalLink>.</p>
        <p>These services provided interfaces to underlying hardware and other system resources.</p>
        <p>All services work by consuming <ExternalLink to="http://graphql.org/">GraphQL</ExternalLink> requests over HTTP, running the requested operation, and then returning a JSON response.</p>
        <p>GraphQL is a query language which allows users to create readable requests which will return only the data they specify.</p>
        <p>GraphQL requests come in two varieties: queries and mutations.</p>
        <h3>Queries</h3>
        <p>GraphQL queries perform informational, read-only operations. For example, a query might request that an underlying piece of hardware be contacted for its current temperature or last data reading.</p>
        <p>An example query for the telemetry database service might look like this:</p>

        <CodeBlock language={"graphql"} code={samplequery} />

        <p>This translates to "please fetch all of the stored telemetry entries for the EPS subsystem and return only their timestamp, parameter, and value values."</p>
        <p>The response might look like this:</p>

        <h3>Mutations</h3>
        <p>GraphQL mutations perform actions which can be invasive or destructive, for example, writing data to a file or rebooting a hardware device.</p>
        <p>An example mutation for the telemetry database service might look like this:</p>

        <p>This translates to "please create a new telemetry database entry for the GPS subsystem's lock status parameter with a value of ‘good'. Return the overall success of the operation and any errors."</p>
        <p>Worth noting, all mutation requests are prefixed with <code>mutation</code> to quickly indicate to the service what kind of action is being requested.</p>
        <p>A successful response should look like this:</p>

        <h3>Schemas</h3>
        <p>Each service has a schema which defines all of its queries and mutations.</p>
        <p>Users should refer to these to determine what actions are available for each service and how their requests should be structured.</p>
        <p>Documentation for Kubos services can be found within the <ExternalLink to="https://kubos-preservation-group.github.io/kubos/ecosystem/index.html#service-docs">services</ExternalLink> section.</p>
        <p>For example, links to the schemas for all of the pre-built hardware services can be found <ExternalLink to="https://kubos-preservation-group.github.io/kubos/ecosystem/services/hardware-services.html#pre-built-services">here</ExternalLink>.</p>

        <h2>Determining Service URLs</h2>
        <p>In order to communicate with a service, we need to know where to send our messages.</p>
        <p>All services rely on a configuration file, <code >config.toml</code>, in order to determine which IP and port they should bind a listener thread to.</p>
        <p>By default, this file is located in <code>/etc/kubos-config.toml</code>. Since we're running these tutorials locally, that file location likely doesn't exist, so instead we are using the <code>~/.kubos/kubos/tools/local_config.toml</code> file in our cloned copy of the kubos repo.</p>
        <p>We'll need to pass our application this path when we go to run it locally.</p>

        <h2>Querying a Service</h2>
        <p>For this tutorial, we'll be querying the <ExternalLink to="https://kubos-preservation-group.github.io/kubos/ecosystem/services/monitor-service.html">monitor service</ExternalLink> to make sure it is successfully up and running.</p>
        <p>The monitor service is a unique hardware service which communicates with the OBC itself in order to obtain information about current processes running and the amount of memory both available and generally present on the system. It is unique because it is not tied to a particular hardware device and can, instead, be run on any supported OBC (or in this instance, the local dev environment). Worth noting, the process of communicating with this service is the same as communicating with any other core or hardware service.</p>
        <p>We intend for this to be an ad-hoc action, so we'll be adding code to the on-command section of our program.</p>
        <p>The all KubOS core services provide a <code>ping</code> query which can be used to verify that the service is currently running on the expected port. The request has the following format:</p>
        <CodeBlock language={"graphql"} code={`{\n    ping\n}`} />
        <p>The response should return a single <code>"pong"</code> result:</p>
        <CodeBlock language={"graphql"} code={`{\n  "data": {\n    "ping": "pong"\n  }\n}`} />
        <p>To make the communication process simpler, we'll be using the <ExternalLink to="https://kubos-preservation-group.github.io/kubos/ecosystem/apps/python-app-api.html">Python app API</ExternalLink> to send our GraphQL requests.</p>
        <p>For each request, it:</p>
        <ul>
          <li>Looks up the HTTP address of the service name which is given from the system's <ExternalLink to="https://kubos-preservation-group.github.io/kubos/ecosystem/services/service-config.html">config.toml</ExternalLink> file</li>
          <li>Wraps the given request into a proper HTTP packet and sends it to the target service</li>
          <li>Parses the response message and checks for errors</li>
          <li>Returns the message payload in the <code>"data"</code> field if the request was successful</li>
        </ul>
        <p>To start, we'll import the API:</p>
        <CodeBlock language={"python"} code={`import kubos_app as app_api`} />
        <p>Then, we'll add a new command line option -c to allow us to pass a non-default config file for testing purposes:</p>
        <CodeBlock language={"python"} code={intargparse} />
        <p>Then, we'll create the query we want to send:</p>
        <CodeBlock language={"python"} code={`request = '{ ping }'`} />
        <p>Next, we'll send the request to the monitor service:</p>
        <CodeBlock language={"python"} code={`response = SERVICES.query(service="monitor-service", query=request)`} />
        <p>And finally, we'll parse the result to get our response string:</p>
        <CodeBlock language={"python"} code={parseresponse} />
        <p>After adding proper structure, our program should look like this:</p>
        <CodeBlock language={"python"} code={properping} />
        <p>If we run our program inside the KubOS container, the output should look like this:</p>
        <CodeBlock language={"bash"} code={`kubos@d9a9758e997f:~$ ./my-mission-app.py -c /home/kubos/.kubos/kubos/tools/local_config.toml\nSuccessfully pinged monitor service`} />

        <h2>Writing Data to the Telemetry Database</h2>
        <p>Now that we have a data point, we need to save it somewhere useful. The telemetry database is the main storage location for all telemetry data. The <ExternalLink to="https://kubos-preservation-group.github.io/kubos/ecosystem/services/telemetry-db.html">telemetry database service</ExternalLink> is the preferred interface point for storing and retrieving that data.</p>
        <p>We'll be using the service's <code>insert</code> mutation in order to add a new telemetry entry. This operation is a mutation rather than a query, because it will cause the system to perform a write, rather than simply reading data.</p>
        <p>The mutation has the following schema:</p>
        <CodeBlock language={"graphql"} code={`mutation {\n    insert(timestamp: Integer, subsystem: String!, parameter: String!, value: String!) {\n        success: Boolean!,\n        errors: String!\n    }\n}`} />
        <p>This indicates that there are four possible input parameters, all of which are required except for <code>timestamp</code>, and two return fields which, when requested, will always return a value.</p>
        <p>Our mutation will have the following parameters:</p>
        <ul>
          <li>subsystem: "OBC" - Indicating that our data point corresponds to the main OBC (other subsystem names might be things like "EPS" or "payload")</li>
          <li>parameter: "available_mem" - Indicating that our data point represents the current amount of available memory</li>
          <li>value - The data value which was returned from our previous query</li>
        </ul>
        <p>All together, our request should look like this:</p>
        <CodeBlock language={"graphql"} code={TelDbReq} />
        <p>Like before, we'll now use the app API to send our request, but this time we'll be sending to the telemetry database service rather than the monitor service:</p>
        <CodeBlock language={"python"} code={`response = SERVICES.query(service="telemetry-service", query=request)`} />
        <p>Finally, we'll check the response to make sure the operation finished successfully:</p>
        <CodeBlock language={"python"} code={TelDbCheckResp} />
        <p>With some error handling, our final application looks like this:</p>
        <CodeBlock language={"python"} code={FinalTelDb} />
        <p>If we run our program from inside the KubOS container, the output should look like this:</p>
        <CodeBlock language={"bash"} code={`kubos@d9a9758e997f:~$ ./my-mission-app.py -c ~/.kubos/kubos/tools/local_config.toml\nSuccessfully pinged monitor service\nTelemetry insert completed successfully`} />
      
        <h2>Creating the Manifest File</h2>
        <p>In order for the applications service to properly maintain versioning information, we'll need to create a new file, <em>manifest.toml</em>, to accompany our mission app.</p>
        <p>This file has the following key values:</p>
        <ul>
          <li><code>name</code> - The name of the application</li>
          <li><code>executable</code> - (Optional) The name of the file to be called to begin application execution</li>
          <li><code>version</code> - The version number of the application</li>
          <li><code>author</code> - The author of the application</li>
        </ul>
        <p>Our file should look like this:</p>
        <CodeBlock language={"toml"} code={`name = "my-mission-app"\nexecutable = "my-mission-app.py"\nversion = "1.0"\nauthor = "Me"`} />
        <h2>What's next?</h2>
        <p>Please implement your own mission application in Rust. An existing example exists on the conainer at <code>/home/kubos/.kubos/kubos/examples/rust-mission-app/</code> if you need an example. However, please take this opportunity to get some practice writing Rust code.</p>
      </div>
    </>
  );
}