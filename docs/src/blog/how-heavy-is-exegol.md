---
title: How heavy is Exegol?
date: 2026-08-21
author: Charlie and Mathieu
description: Exegol's largest images are about 17 GB to download and 45 GB unpacked. On Docker 29 that can look like 63 GB. Lighter profiles exist. Why that is not bloat, what we changed over the years, and how it compares to Kali, Parrot, and VMs.
sidebar: false
tags:
  - docker
  - storage
  - disk-space
  - kali
  - parrot
---

# How heavy is Exegol?

We hear that question a lot. Usually followed by *"Wow, this thing is heavy!"*

But is it, really?

It is a fair question. Whenever we add a tool or change a build pipeline, we deal with it.

This post shows why Exegol is not as heavy as it looks at first glance, and how it compares to Kali Linux, ParrotSec, and a pile of VMs. We will walk through what we have changed over the years, what changed in Docker lately, and how we spotted it and took it to the Docker team.

## How heavy it is

In this post we focus on the **largest** images (`free`, `full`, and `nightly`), and we round the numbers. `free` is a `full` image a couple of versions behind: all tools, available on the Community tier. `full`, `nightly`, `light`, `web`, `osint`, and `ad` are Pro and Enterprise (see the [image types](/images/types){target="_blank"} page). Community (`free`) updates about three times a year. Pro and Enterprise images update about monthly.

Think of an **image** as an ISO. It is a template. You do not work in the image, you work in a **container**, which is that template plus a thin writable layer (whatever you install, cache, or drop in after creation). Ten containers from the same image do not mean ten copies of the toolkit. The image is stored once. Each container only adds its own layer.

The [workspace](/wrapper/#workspace) is a folder on the host, bind-mounted at `/workspace`. Engagement files live there, not inside the image. Same idea for [exegol-resources](/resources/) (`/opt/resources`): extra data on the host, not baked into the 45 GB. What *you* copy into a container (loot, extra tools, Burp project files on the writable layer) is on you. We do not count that in the figures below.

Three different numbers:

- **Compressed image size** is what `exegol install` downloads. On [Docker Hub](https://hub.docker.com/r/nwodtuhs/exegol), `free` is about **17 GB** (compressed).
- **Unpacked image size** is the filesystem you actually run. Layers are gzipped in the registry; Docker expands them locally. For the large images, about **45 GB**.
- **On-disk image usage** is what the SSD loses. That depends on the Docker storage driver. With different Docker configurations, the same image can take **45 GB** (unpacked only) or **63 GB** (compressed plus unpacked). Details in [Why on-disk image usage varies](#why-on-disk-image-usage-varies).

A container, on a healthy setup, should be small: configs, caches, maybe a few packages.

What fills those 45 GB is a [ready toolkit](/images/tools): about 400 tools on `free`/`full`/`nightly`. Isolated virtualenvs, Java for Burp, Neo4j for BloodHound, Firefox, wordlists. Weight is one of the filters in [Choosing tools for Exegol](/blog/choosing-tools). If you do not need the whole box, Pro and Enterprise can pull `light` (about 50 tools), `osint`, `web`, or `ad` instead.

## Storage story

We have been treating size as a product problem from fairly early on. The short version: put the toolkit in the **image** once, keep containers thin, delete leftovers, and do not leave two generations of a 45 GB tag on disk because someone forgot `docker rmi`.

**2022.** Early cuts were crude and useful. ExploitDB and SecLists were trimmed to make the image lighter. We moved leftover Kali bits to Debian.

**2023.** Git clones started using `--depth 1` so we stopped pulling full histories for tools we only need at HEAD. The wrapper started telling you, at pull time, both the compressed download and the estimated unpacked size ([PR #189](https://github.com/ThePorgs/Exegol/pull/189) by [ShutdownRepo](https://github.com/ShutdownRepo)). `auto_remove_image` defaulted to on: when you `exegol update` to a newer tag, and you remove the last container that still used an outdated image, the wrapper deletes the old one. Two `free` generations on a laptop is how disks fill up. You can turn that off in `~/.exegol/config.yml`, but we advise against it.

**2024.** [Exegol-images#333](https://github.com/ThePorgs/Exegol-images/pull/333) by [gbe](https://github.com/gbe) made shallow clones the default across install scripts. [Exegol-images#334](https://github.com/ThePorgs/Exegol-images/pull/334), also [gbe](https://github.com/gbe), dropped sslscan build leftovers. Contributor docs started saying: compile in `/tmp`, keep the binary, do not ship the toolchain.

**2025.** Size review became a habit on additions, not a one-off purge, largely thanks to [skyf0l](https://github.com/skyf0l): [Exegol-images#448](https://github.com/ThePorgs/Exegol-images/pull/448) purges language caches between layers (Rust, npm, nvm, bundler). [#462](https://github.com/ThePorgs/Exegol-images/pull/462) prefers `make clean`. Go module cache and BloodHound caches went away ([#517](https://github.com/ThePorgs/Exegol-images/pull/517), [#516](https://github.com/ThePorgs/Exegol-images/pull/516)). `cargo binstall` replaced dragging full crates ([#520](https://github.com/ThePorgs/Exegol-images/pull/520)). 3.1.9 dropped ZAP after it was clear Burp and Caido were what people used ([the ZAP story](/blog/choosing-tools#a-quick-example-the-zap-story)). 3.1.12 was a dedicated pass: about 500 MB of debconf ([#635](https://github.com/ThePorgs/Exegol-images/pull/635)), leftover JDK archives ([#637](https://github.com/ThePorgs/Exegol-images/pull/637)), lighter jadx ([#638](https://github.com/ThePorgs/Exegol-images/pull/638)), lighter chainsaw ([#639](https://github.com/ThePorgs/Exegol-images/pull/639)). Every build still ends in `post_install()`: apt lists, `/tmp`, pip/npm/cargo/go/gradle caches.

Not every idea shipped. Pruning `.git` inside tool trees ([#483](https://github.com/ThePorgs/Exegol-images/pull/483), still [skyf0l](https://github.com/skyf0l)) got reverted when it broke updates. Size work has to survive the test suite.

**March 2026, wrapper.** Users (and we) started seeing `exegol info` print about 17 GB for an installed `free` image while the disk said 45 or 63. Docker's `Size` field was no longer "bytes on disk". We shipped a fallback in [PR #299](https://github.com/ThePorgs/Exegol/pull/299) by [ShutdownRepo](https://github.com/ShutdownRepo), released as [5.1.10](https://github.com/ThePorgs/Exegol/releases/tag/5.1.10): if an official image comes in below a floor we know is impossible, show an unpacked estimate (about 45 GB for `free`) instead of the bogus 17 GB. [skyf0l](https://github.com/skyf0l) opened [PR #300](https://github.com/ThePorgs/Exegol/pull/300) to print each container's writable layer (`SizeRw`) plus the workspace.

**March to April 2026, images.** We were also measuring **containers**, not just images. Burp's first run (app files, CA for Firefox) was happening at container start. Every new container paid for it again in its writable layer. Tests made that obvious. In [images 3.1.15](https://github.com/ThePorgs/Exegol-images/releases/tag/3.1.15) we moved that init into the image build (`install_burpsuite` starts Burp headless, waits, stops, drops leftover Java prefs). Release note: "Fix to Burp install process leading to overweight containers".

By then we had a workaround in the wrapper, a container-size PR on hold, and a still-fuzzy story about why Docker's numbers disagreed. The next section is what we did with that.

## Why on-disk image usage varies

This is the part we are writing now.

After [PR #299](https://github.com/ThePorgs/Exegol/pull/299) we kept watching `exegol info`, `docker image inspect`, `docker image ls`, and `df`. Same `nwodtuhs/exegol:free` tag, different hosts, different stories. People on a fresh Docker 29 install saw the jump: about 45 GB unpacked becoming about 63 GB on disk, and our size fallback kicking in ([PR #299](https://github.com/ThePorgs/Exegol/pull/299)). People who had *upgraded* an older Engine still on `overlay2` did not. We were finally able to locate and reproduce the issue on Engine 29.7.2 and opened [moby/moby#53398](https://github.com/moby/moby/issues/53398) in August 2026.

> [!NOTE] Check your storage driver
> `docker info`, look at `Storage Driver`. `overlayfs` is the containerd image store (default for [new Docker Engine 29 installs](https://www.docker.com/blog/docker-engine-version-29/), November 2025, and already default on Docker Desktop). Packed copy (about 17 GB) and unpacked snapshots (about 45 GB) sit next to each other. `docker image ls` **DISK USAGE** is the sum. `docker image inspect` `.Size` is only the packed copy.

Until Engine 29, most Linux daemons used the **`overlay2`** graph driver: unpack, drop the compressed tarballs, report `Size` as something close to real disk usage (about 45 GB for `free`). Fresh 29 installs default to the **containerd image store**. Upgrades usually keep `overlay2` until you opt in. Two machines, same tag, two different on-disk sizes.

The same JSON field, `Size`, answers a different question depending on the driver:

- `overlay2`: `Size` = unpacked = disk usage (about 45 GB)
- containerd / `overlayfs`: `Size` = packed content only (about 17 GB) ≠ disk usage

That caught every client that treated `Size` as "bytes on disk", including `exegol info` and the official Python SDK (`docker-py`). We opened the issue. The Docker team was on it the same day. [Sebastiaan van Stijn](https://github.com/thaJeztah) (`thaJeztah`) walked through the two stores: graph drivers discarded packed content; containerd keeps both; **DISK USAGE** is the sum. [Paweł Gronowski](https://github.com/vvoland) (`vvoland`) agreed inspect should follow the same accounting as image list, wrote [moby/moby#53426](https://github.com/moby/moby/pull/53426) to include unpacked snapshot usage in inspect `Size`, and [thaJeztah](https://github.com/thaJeztah) approved and merged it. Fast, and they treated the mismatch as a real inconsistency. That fix landed in an **August 2026** Engine patch. On patched daemons, `docker image inspect` on `overlayfs` finally matches **DISK USAGE** (about 63 GB). Before that, inspect still reported packed content only (about 17 GB). `docker-py` still does not expose `?manifests=1`, so the wrapper cannot just flip a flag for **DISK USAGE** without going through inspect.

What you see today depends on the storage driver and on whether your Engine has that patch. That is the whole point.

| | `overlay2` | `overlayfs` / containerd (before Aug 2026 patch) | `overlayfs` / containerd (patched Engine) |
|---|---|---|---|
| **`exegol info`** | ~45 GB (real unpacked size) | ~42 GB ([PR #299](https://github.com/ThePorgs/Exegol/pull/299) unpacked estimate; better than the 17 GB `Size`, still not the 63 GB disk usage) | ~63 GB (matches **DISK USAGE** once inspect reports unpacked snapshots) |
| **`docker image ls` DISK USAGE** | ~45 GB | ~63 GB (packed plus unpacked) | ~63 GB (packed plus unpacked) |
| **`docker inspect` `.Size`** | ~45 GB | ~17 GB (packed content only) | ~63 GB (packed plus unpacked) |

Do not size a disk from `inspect` on `overlayfs` until your Engine has the August 2026 patch. Do not compare `exegol info` on one machine with `docker image ls` on another without checking `docker info` and your Engine version first.

What this follow-up unblocks for the next wrapper release: a more precise view on storage, including real container size in `exegol info` (the [PR #300](https://github.com/ThePorgs/Exegol/pull/300) work by [skyf0l](https://github.com/skyf0l)), and a **warning when the daemon is on `overlayfs`**, so a 45-to-63 GB jump is explained preemptively.

Graph drivers are [deprecated](https://www.docker.com/blog/docker-engine-version-29/). However, staying on the legacy `overlay2` avoids storing packed plus unpacked. It is a local trade if the disk is tight. It is not a long-term freeze we recommend to everyone. See [What to do if the disk is tight](#what-to-do-if-the-disk-is-tight).

## How Exegol compares to others

### Virtual machines

One Kali (or Parrot, or whatever) VM per engagement is a theoretical classic. We have met plenty of people who reuse one VM across scopes, but for isolation many teams still aim at one environment per client or timeframe.

[Kali's own install sizes](https://www.kali.org/docs/installation/installation-sizes/) (2024.1) land in the same ballpark as Exegol once the toolkit is there (actually a bit less, but the page is two years old, so it may have evolved since). Default is about 13 GB, large about 20 GB, everything about 35 GB. They tell you to plan on about **60 GB** per install. Parrot is the same kind of guest: a full OS plus a toolkit, tens of gigabytes, plus whatever you snapshot.

**1 environment.** A single Exegol `free` image weighs about 45 to 63 GB on disk. A single (full) Kali or Parrot VM sits in the same range once you count real disk use, not just the ISO download. The footprint is similar.

Where Exegol still wins on a single box is from its resilience, but that's a topic for another day.

**3-5 environments** is where the gap widens, and it widens because of **Docker**:

- **Independent VMs / full clones.** Each one is a full disk. Three guests at about 45 GB used is about **135 GB**. Five is about **225 GB**. If each virtual disk is provisioned at Kali's 60 GB guidance, you are looking at **180 GB** or **300 GB** on the host.
- **Snapshots on one VM.** The base is still about 45 to 60 GB. Each snapshot stores a delta of what changed. A restore point after updates, extra tools, or a messy engagement is not free, and chains grow. You also do not get real isolation: one hostname, one machine identity, one guest to blow up.
- **Linked clones.** On paper this is the VM answer to Docker layers: one parent disk, thin deltas per clone. In practice the parent is a single point of failure (move it, and the clones die), each clone still carries VM overhead, and anything you install or upgrade in a clone lands in *that* clone's delta. Three to five clones that drift (different tools, different `apt upgrade`) stop being thin. Even a well-behaved set is parent (~45 to 60 GB) plus several gigabytes per clone.

Exegol on Docker: the **image is stored once**. Three to five containers are thin writable layers (megabytes, maybe a couple of gigabytes if you actually install extra things). Total image on disk stays about **45 GB** or **63 GB**, plus workspaces on the host, which you would have paid for as project folders in the VMs anyway. Same ballpark for one engagement. Very different bill when you run several in parallel. That is the Docker choice paying off.

Kali and Parrot both support Docker by the way. Official images exist. What those images actually contain deserves a comparison.

### Kali Linux (Docker)

Kali has done a huge job for the community. It is still a very good way to learn and get into offensive security. The ISO, the docs, the metapackages, the muscle memory of a generation of pentesters: none of that is in dispute.

[`kalilinux/kali-rolling`](https://hub.docker.com/r/kalilinux/kali-rolling) is a weekly base OS, about **50 MB** compressed on Hub. Kali's [Docker docs](https://www.kali.org/docs/containers/official-kalilinux-docker-images/) are explicit: **no tools by default**. Next step: `apt update && apt -y install kali-linux-headless` (or `kali-linux-large`, …).

That is a starting point for *your* Dockerfile. It is not plug and play. `apt install` writes into the container **writable layer**. The 50 MB image stays shared. The 13 to 35 GB of tools do not. Five engagements, five installs, five copies. You can bake a custom image on top. At that point you own rebuilds, tests, and need to manually handle the Docker CLI.

### ParrotSec (Docker)

[ParrotSec on Docker Hub](https://hub.docker.com/u/parrotsec) currently has 13 repositories. Two are environments. The rest are single tools.

[`parrotsec/core`](https://hub.docker.com/r/parrotsec/core) is the empty-ish base. [`parrotsec/security`](https://hub.docker.com/r/parrotsec/security) is the bundled CLI image, about **5 GB** compressed. Their README: graphical tools were "excluded for obvious reasons." No Burp, no BloodHound GUI, no Wireshark. Fine as a throwaway CLI box. Not an assessment desktop.

Then `nmap`, `sqlmap`, `metasploit`, `set`, `bettercap`, `beef`, `netexec`, `tshark`, `evil-winrm`, `gobuster`, `ffuf`. Their examples start a `security` container for "pentest" and a **separate** Metasploit container for the listener.

### Bare-metal

Installing the toolkit on the host is the least professional default for this job. You get one snowflake, no isolation per client, and an `apt upgrade` that can land in the middle of a test. Redoing the machine every engagement is a real workflow in a few locked-down or air-gapped contexts. It is also slow, tedious, and throws away the sharing story containers exist for. Most of that pain is time, and gigabytes aren't the issue: see [Exegol on $50M a mission](/blog/saving-time).

### Your own

You can always go smaller than Exegol. Skip isolated virtualenvs. Drop the GUI. Leave wordlists on a USB stick. Do not run unit tests. Drop sources after install and keep binaries only. You will win some gigabytes. You will spend them again the first time two Python tools disagree though, or `apt upgrade` lands mid-test and breaks everything.

### Conclusion

The hours are not in the extra 4 GB. They are in becoming part-time sysadmin for your laptop, and sometimes for the team's. Users outsource that to us. Those choices cost space. They are why a Monday morning container actually works.

Exegol's approach is simpler (and more stable). Docker is at its core. It *obviously* includes the graphical tools, and even a full graphical desktop you can access through your browser. Once an image is downloaded, no extra install or setup is necessary: you are ready to roll. And it comes with the wrapper that sits on top of everything so you don't have to mess with the Docker CLI.


| | **1 environment** | **3–5 environments** | **Comments** |
|---|---|---|---|
| **Exegol** | ~45–63 GB | ~45–63 GB (one shared image + thin layers) | Full toolkit, GUI and browser desktop, `exegol start` |
| **VM** | ~45–60 GB | ~135–300 GB (full disk each) | Full OS + tools, GUI, hypervisor and snapshot overhead |
| **Kali Docker** | ~50 MB base, then you `apt install` | Tools copied per container | Empty image, you install, `docker run` trivia |
| **Parrot Docker** | ~10 GB on disk (`security`) | Split across images | CLI bundle only, no GUI, `docker run` trivia |

## What to do if the disk is tight

> [!WARNING] Data loss
> Changing the storage driver hides the images and containers you already have. They stay on the old driver and will not show up until you switch back. Export or push anything you still need before you change it. You will lose access to what is there. And you should purge and clean house before switching. If you're an Enterprise customer, we can assist you if needed.

**Check the storage driver first.** `docker info`, then look at **Storage Driver**. If you are on Docker 29's containerd store (`overlayfs`) and the ~63 GB figure is what hurts, going back to **`overlay2`** avoids keeping packed and unpacked copies side by side (see [Why on-disk image usage varies](#why-on-disk-image-usage-varies)). Docker documents prerequisites, the data-loss risk, and how to configure `overlay2` in [Configure Docker with the `overlay2` storage driver](https://docs.docker.com/engine/storage/drivers/overlayfs-driver/#configure-docker-with-the-overlay2-storage-driver). Read that page before you change anything. For the wider picture (Engine 29 defaults, containerd vs graph drivers), see [Select a storage driver](https://docs.docker.com/engine/storage/drivers/select-storage-driver/).

**Exegol habits that help on any driver:**

- **Let the wrapper drop outdated images.** Leave `auto_remove_image` on. `exegol update` and removing the last container on an old tag are supposed to free that generation.
- **Use [`exegol upgrade`](/wrapper/cli/upgrade) to move containers to a newer image** (Pro/Enterprise). It recreates the container on the new tag while keeping workspace and key data, so you are not stuck running an old generation while the new image sits beside it on disk. Drop the `-bak` backup when you no longer need it.
- **Docker Desktop's virtual disk defaults to 64 GB.** One large image on containerd can exceed that while the physical disk is empty. Settings → Resources → Advanced. Do not shrink it later without a backup: Desktop deletes the disk image. [Troubleshooting](/troubleshooting#disk-space).
- **Put Docker's data on a fast external disk** if the internal one is small. [External drive FAQ](/faq#how-to-install-exegol-on-an-external-drive). A slow drive makes the whole environment feel slow.
- **Failed pulls leave leftovers** on containerd. `docker image prune` / `docker builder prune`. After a failed `exegol build`, same story.

## TL;DR

- Largest Exegol images (`free`, `full`, `nightly`): about **17 GB** to download, about **45 GB** unpacked. Smaller profiles exist for Pro and Enterprise ([image types](/images/types){target="_blank"}).
- Images are templates. Containers are thin layers on top. Ten containers share one image. Workspace and resources live on the host.
- On-disk usage is about **45 GB** on `overlay2`, about **63 GB** on Docker 29's containerd store (packed plus unpacked). Exegol did not grow 20 GB overnight.
- We have been cutting image fat for years, auto-removing unused old tags, and moving first-run junk (Burp) into the image so containers stay thin.
- After wrapper [PR #299](https://github.com/ThePorgs/Exegol/pull/299) and user reports, we opened [moby/moby#53398](https://github.com/moby/moby/issues/53398). The Docker team agreed inspect was inconsistent, and [vvoland](https://github.com/vvoland) shipped [moby#53426](https://github.com/moby/moby/pull/53426) ([thaJeztah](https://github.com/thaJeztah) approved). On patched Engine (August 2026 onward), `exegol info` and inspect match the ~63 GB **DISK USAGE** on `overlayfs`. Before that, [PR #299](https://github.com/ThePorgs/Exegol/pull/299) showed ~42 GB as a fallback. The next wrapper release will still add container size and warn on `overlayfs`.
- Kali's official Docker image is about 50 MB because it is empty. Parrot splits tools across images and drops GUIs. VMs copy the whole disk three to five times. A hand-maintained box can save a few GB and cost the week ([saving time](/blog/saving-time)).
- Tight disk: check the driver; follow Docker's [overlay2 configuration guide](https://docs.docker.com/engine/storage/drivers/overlayfs-driver/#configure-docker-with-the-overlay2-storage-driver) before switching; keep auto-remove on; raise Docker Desktop's virtual disk.

*— Charlie & Mathieu*
