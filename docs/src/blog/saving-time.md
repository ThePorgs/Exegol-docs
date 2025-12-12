---
title: Exegol on $50M a mission
date: 2025-12-12
author: Charlie
description: Six years after Exegol's birth, we take a hard look at whether we've kept one of our promises, saving offensive cybersecurity professionals time so they can focus on what they do best.
sidebar: false
---

# Exegol on $50M a mission

Anyone working in offensive cybersecurity knows that having the right toolkit is essential for being efficient. But with the ever-growing number of tools, programming languages, and installation methods, our environments keep getting heavier and harder to maintain. Whether you prefer bare metal installs, virtual machines, cloud instances, or containers, each option comes with its own challenges. Numerous distributions exist, each offering different toolsets and philosophies. 

But no matter what we choose, the reality is that we spend far too much time configuring, installing, maintaining, and customizing these environments. We should be spending this time on hacking, not troubleshooting. Instead of focusing on our core job, we end up becoming part-time sysadmins for our own setups, and sometimes for our teams as well.

Exegol was born from that. As a way to save time, be more productive, more efficient, and really keep that promise instead of making it a punchline.

This article comes nearly six years after Exegol began and takes a straightforward look at whether we've delivered on one of our original promises: saving offensive security professionals' time.

## Where do we lose time?

### Installation and update hassles

We all waste too much time just getting our tools installed and up to date. There are so many different ways to install things: package managers, cloning Git repos, downloading binaries, or compiling by hand. Tools get updated often, so we’re constantly re-installing, reading instructions that might be out of date, and running into new errors. If documentation is missing or confusing, we end up searching forums and random blog posts for help.

### Dependency hell

When you install several tools, their dependencies can end up in conflict. Maybe you need a specific version of Python for one tool, and a different version for another. Modern Python, for example, insists on using virtual environments to prevent breaking system packages. This is helpful, but it also means spending extra time creating, activating, and managing those environments for each project. The same headache exists with Ruby, Rust, or other languages that have their own environment managers. Sometimes you have to compile tools from source, which requires tracking down even more dependencies and handling strange errors that depend on your operating system. All of this troubleshooting often takes longer than actually using the tool.

### Team misalignment and repeating setups

In a team, everyone can end up with different versions installed, which leads to confusion and "it works on my machine" moments. Setting up the same environment on multiple machines means repeating configs, working around hardware differences, and troubleshooting again and again. People using virtual machines have to manage and revert snapshots, which takes even more time. If you mess up a snapshot, you might even lose data.

### Environments slowly breaking down

Over time, your setup gets messy. You collect unused dependencies, settings change, and things get less stable. On bare metal, you might eventually wipe everything and start over. If you use containers, you have to understand Docker commands and configuration files, which involves its own learning curve. If your distro is missing certain tools or configs, you end up writing your own scripts or playbooks, which adds more work.

### Managing assets and unexpected breakdowns

You also spend time finding, downloading, and organizing wordlists, scripts, and other resources. Sometimes, a tool update breaks your setup right in the middle of an engagement, forcing you to stop and fix things quickly. Virtual machines can take forever to boot or randomly fail when the hypervisor has issues, which interrupts your work.

### Upgrade anxiety and accidental sysadmin chores

After enough breakages, you start worrying that any upgrade might break your setup. Most of us have a horror story about running `apt upgrade`. For teams, someone always ends up maintaining the shared infrastructure, doing sysadmin chores instead of offensive security work.

## Have we solved those issues?

We've tackled most of these pain points head-on. Here's how:

- **Pre-configured Docker images with ready-to-use tools**, eliminating manual installations, compilation, dependency resolutions, and troubleshooting. Exegol users have outsourced this issue to us, the Exegol maintainers—and we like that deal. Our [images](/images/types) come with hundreds of tools pre-installed and configured, ready to go.

- **Tools installed in isolated virtual environments by default**, following our [installation standards](/contribute/images#installation-standards). Each Python tool is installed in its own virtualenv, Ruby tools are organized with rbenv, NodeJS tools in their own npm-managed sandboxes, and Rust tools are separated via cargo, all ensuring dependencies remain clean and never conflict. This means you can update or use any tool without worrying about overwriting something else or breaking your environment—the right version for every tool, automatically and reliably.

- **Containers that mean way less overhead than VMs**, with a [wrapper](/wrapper/features) to avoid the complexity of using containers. Easy, fast, and dedicated environments. No more hypervisor headaches or snapshot management nightmares.

- **Cross-platform and cross-OS support**, so that you can keep your own OS without having your infosec toolbox break every now and then. Whether you're on Linux, macOS, or Windows, [Exegol works](/first-install).

- **Pre-loaded offline resources** like wordlists, dictionaries, and scripts, streamlining sourcing and organization. Our [resources system](/resources/list) ensures you have what you need, when you need it, without hunting through GitHub repos or outdated forums.

- **Mid-engagement breakdowns happen way less often**, if at all anymore. And on the rare occasion they do, spinning up a brand new environment takes seconds. No more scrambling to fix a broken setup while a client waits.


The bottom line? We've shifted the burden of environment management from you to us. We build, so you can hack.

## How many people did we solve this for?

Here’s a snapshot of our community and ecosystem impact as of this writing:

- 360,000+ DockerHub pulls
- 140,000+ PyPI installs (since April 2022)
- 3,000+ [Discord](discord.exegol.com) members (community launched in October 2022)
- 3,000+ [LinkedIn](linkedin.exegol.com) group members (launched February 2025)
- 50+ GitHub contributors, with around 10 considered "active"


As an infosec company, privacy is important to us, so we intentionally avoid extensive user tracking. This means we have limited direct data to measure our reach.

Considering the [1% rule](https://en.wikipedia.org/wiki/1%25_rule) or the [90-9-1 rule](https://www.nngroup.com/articles/participation-inequality), we can estimate our user base to roughly 20,000-30,000 people. These numbers are approximations based on observable signals and community engagement.

## How much time have we saved?

Let's do some math. Say the solutions Exegol implements saves its users 5 minutes per work day, 200 days per year. That's 1,000 minutes (or about 16.67 hours) saved per user annually.

Say we started with 1 user in 2020, and ended up with 20k by the end of 2025.

If we assume that the growth has been linear (which is how we felt it, but there's no actual data supporting that), it's a total of 1M hours. If we assume it was an exponential growth, it's a total of 200k hours.

**The calculations:**

For linear growth, we assume the user base increases steadily from 1 to 20,000, so the number of users at time $t$ (in years) is:

$$N(t) = 1 + \frac{19999}{6} \times t$$

The cumulative user-years is the integral from 0 to 6:

$$\int_0^6 N(t) \, dt = \int_0^6 \left(1 + \frac{19999}{6} \times t\right) \, dt = 6 + \frac{19999}{6} \times \frac{6^2}{2} = 60,003 \text{ user-years}$$

Multiplying by 1,000 minutes per user-year and dividing by 60 yields approximately **1,000,050 hours saved** (or 1M hours).

For exponential growth, we assume $N(t) = e^{kt}$ where $k = \frac{\ln(20000)}{6} \approx 1.65058$, so the cumulative user-years is:

$$\int_0^6 N(t) \, dt = \int_0^6 e^{kt} \, dt = \frac{20000 - 1}{k} \approx 12,116 \text{ user-years}$$

Multiplying by 1,000 minutes per user-year and dividing by 60 yields approximately **201,939 hours saved** (or 200k hours).

Linear growth results in more total savings due to a higher average user count over time compared to exponential growth, which concentrates users toward the end. Reality probably sits somewhere in between, but either way, the numbers are significant.

## Time is money

Say average salary for Europe for offensive cybersecurity experts is $60k (~50k€) and $100k in the US (some data suggest higher average salary but let's be conservative).

Employer overheads (taxes, social contributions, benefits) add 40 to 50% in the US and 40-60% in Europe (varying by country). Applying a conservative blended 45% overhead gives an average annual employer cost of $98,600. Dividing by 2,080 work hours results in an hourly employer cost of approximately $47.

To account for opportunity cost (revenue potential from billable work), penetration testing services bill at $100-$400/hour in the US and €140-€250/hour (~$164-$292 USD) in Europe. Not all roles are fully billable, so we conservatively add a partial factor, adjusting the effective hourly value to **$50**. This reflects saved time enabling productive or revenue-generating activities without overstatement.

Using this $50/hour value, money saved totals to **$50 million** in the linear growth model and **$10 million** in the exponential growth model.

These conservative figures represent total economic value saved across users over six years, heavily weighted toward Europe given our user distribution, incorporating direct costs and modest productivity gains. The exponential model remains lower due to growth concentration in later years.

## Conclusion

Six years ago, Exegol started as a simple answer to a frustrating problem: too much time spent managing environments, not enough time hacking. Today, the numbers tell a story we're proud of.

Whether it's 200k hours or 1M hours saved, whether it's $10M or $50M in economic value, the message is the same: we're going in the right direction. We've saved time. We've let our users focus on what they actually want to do. We've sometimes spent hours fixing a 5 seconds lag. We know why now.

Seeing these numbers is both validating and energizing. They reinforce our commitment and, we hope, will inspire further belief in Exegol’s mission.

*— Charlie, Co-founder and CEO*

