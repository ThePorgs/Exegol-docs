# Frequently asked questions

Below are the frequently asked questions regarding either features or
the overall project.

## What tools are installed in Exegol?

The list of tools is dynamically generated for all Exegol images and
available [here](/images/tools).

## What is the difference between Community, Pro and Enterprise?

The comparison, including images, commercial use, seats and support, is on [exegol.com/pricing](https://exegol.com/pricing). Enterprise includes everything in Pro.

[Exegol Sentinel](/sentinel/) is a paid Enterprise add-on. It is documented here; it is not listed on the pricing page yet. The legal rules (commercial use, seats, exploitation) are in the [legal summary](/legal/summary).

## What is Exegol Sentinel?

[Exegol Sentinel](/sentinel/) is an Enterprise add-on. It records every interactive command typed in an Exegol container as one structured event on the host, and can collect extra artifacts when a profile rule matches. It does not prevent, detect or block anything. See [Getting started](/sentinel/getting-started).

## What is the difference between shell logging and Sentinel?

They are independent features and can be used together.

- [Shell logging](/wrapper/#shell-logging) (`--log`) is a **session recorder**: it captures the terminal stream (stdin, stdout, stderr) into files under `/workspace/logs`.
- [Exegol Sentinel](/sentinel/) is a structured **audit record per finished command**, written on the host for a person or a SIEM to read. It is an Enterprise add-on.

## What is a container profile?

A [container profile](/wrapper/profiles/) is a named set of container-shape defaults (the image, the shell, the network mode, the mounts, the capabilities and more) stored as a YAML file whose file name is the profile name. It is applied when a container is created, with anything typed on the command line taking precedence over what the profile declares, and it is selected with `exegol start --profile <name>`.

Container profiles require a Professional licence or above; see [the tier comparison](/faq#what-is-the-difference-between-community-pro-and-enterprise). The full documentation is at [Container profiles](/wrapper/profiles/).

## What is the difference between a container profile and a Sentinel profile?

They are independent features and can be used together.

- A [container profile](/wrapper/profiles/) is a **container-shape declaration**: it describes how a container is built (which image it starts from, which shell it opens, how it is attached to the network, what is mounted into it and which privileges it holds). It requires a Professional licence or above.
- A [Sentinel profile](/sentinel/profiles/concepts) is an **audit-collection rule set**: it describes what a container's command journal records, and which extra evidence is collected when one of its rules matches. It changes nothing about the container's shape.

The two meet in one place: a container profile may itself carry a `sentinel` section, which is where a container created from that profile declares whether audit logging is enabled and which Sentinel profile it uses.

## Can I run Exegol on a macOS?

Yes. And both CPU architectures are supported (Intel X86_64 (AMD64) and
Apple Silicon M1/M2 (ARM64).

> [!SUCCESS] Tip 
> We strongly advised macOS users to replace Docker Desktop with
> [OrbStack](https://orbstack.dev/), allowing host network mode to work
> for instance, as it's not supported by Docker Desktop for Mac.

## Can I use a VPN with Exegol?

Yes. And you have multiple choices.

- **The "YOLO" choice**: at the container creation (i.e. when "starting"
  a container for the first time), give all permissions to the container
  so that you're able to run openvpn in it and start the vpn. The
  command should look like
  `exegol start <container_name> <image_name> --privileged`.
- **The better choice**: use the `--vpn` option at the container
  creation:
  `exegol start <container_name> <image_name> --vpn <myconf.ovpn>`. It's
  the easiest and more secure choice. See the `start` help
  [here](/wrapper/cli/start).

> [!WARNING]
> Creating a **privileged** container (c.f. the "YOLO" choice) exposes
> you to higher security risks. This should be avoided.

## Can I customize Exegol?

Yes, please refer to the
["my-resources" documentation](/images/my-resources) that
explains how to automatically setup your changes to your Exegol
containers. Also, see the
["wrapper configuration" documentation](/wrapper/configuration)
to see how to edit Exegol's conf among other things. You could also want
to [make your own Exegol image](/faq#can-i-make-my-own-exegol-image)

## Can I make my own Exegol image?

Yes. You will need to create a dockerfile (e.g. `CUSTOM.dockerfile`) at
the root of the exegol-images module next to the other dockerfiles (i.e.
`/path/to/Exegol/exegol-docker-build/`) containing the instructions you
want the build process to follow.

Then, run something like `exegol install "myimagename" "CUSTOM"` to
build the image locally. See the `install` documentation:
[install action](/wrapper/cli/install).

## How to install Exegol on an external drive?

Exegol's wrapper is lightweight, but its Docker images can take up some
space, and users may not have enough room in their internal HDD/SSD,
hence the question. This usually comes down to "how can I install Docker
on an external drive?", and the answer depends on the host.

> [!SUCCESS] Tip
> Use a fast drive, otherwise Exegol will get real slow.

For macOS and Windows users, this can be configured in the Docker
Desktop dashboard (in
`Settings > Resources > Advanced > Disk image location`).

<img src="/assets/faq/docker_desktop_disk_image_location.png"
class="align-center"
alt="Disk Image Location Setting (Docker Desktop)" />

## How to add a new tool?

"Adding a tool" can mean many things. Depending on that, you'll get a
different answer. So let's answer most of them.

If you want to add a tool:

- **in the official Exegol images**: refer to the
  [image contribution guidance](/contribute/images#making-changes).
- **in your own custom local image**: follow the same
  [image contribution guidance](/contribute/images#making-changes), but instead of
  creating a Pull Request at the end to offer your contribution, just
  build the image locally with the wrapper and enjoy your custom local
  image.
- **in a live container**: that's your container, you can do whatever
  you wish in it ;)
- **automatically in all containers at their creation**: refer to the
  ["my-resources" documentation](/images/my-resources).

## Can I install docker directly on my WSL2 distro instead of Docker Desktop ?

Yes, it's possible to install docker directly on WSL2 rather than using
Docker Desktop, but you'll be restricted to your WSL2 environment and
its constraints.

Although Docker Desktop is incomplete, it does offer a few advantages
(exegol can be used from powershell / cmd, windows folder sharing with
the exegol workstation, etc). We therefore recommend **Docker Desktop as
the official support** for Exegol.

We do **not** guarantee wrapper stability with a directly installed WSL
docker.

## How to retrieve your desktop login details ?

The container's root password can be obtained with
`exegol info <container>` (i.e. this is needed when using the
[desktop](/wrapper/#desktop) feature)

## WSL 2 consumes massive amounts of RAM, CPU power, and disk space. How can I deal with this issue?

WSL 2 does not always free RAM when processes finish, so unused memory stays allocated on the host. More detail is in [this GitHub issue](https://github.com/microsoft/WSL/issues/4166). A simple workaround is to create a `%UserProfile%\.wslconfig` file on Windows and limit the WSL 2 VM:

```ini
[wsl2]
memory=8GB
processors=2
```

When Docker uses the WSL 2 backend, Windows also manages disk. After an Exegol image update, Docker can temporarily take about twice the image size. Find **Disk image location** in Docker Desktop (`Settings > Resources > Advanced`). It is typically under `C:\Users\<USER>\AppData\Local\Docker\wsl\`. The virtual hard disk is `C:\Users\<USER>\AppData\Local\Docker\wsl\disk\docker_data.vhdx`. Shrink it with `diskpart` ([steps](https://stackoverflow.com/questions/70946140/docker-desktop-wsl-ext4-vhdx-too-large)):

1. Stop Docker Desktop.
2. Open an administrative CMD or PowerShell session.
3. Stop WSL 2: `wsl --shutdown`
4. Start diskpart: `diskpart`
5. Select the disk: `select vdisk file="C:\Users\<USER>\AppData\Local\Docker\wsl\disk\docker_data.vhdx"`
6. Shrink it: `compact vdisk`
7. Wait until the process reaches 100%.

## How do I update Exegol?

`exegol update`

> [!SUCCESS] Hint
> If you installed the wrapper with pipx, update with `pipx upgrade exegol`
