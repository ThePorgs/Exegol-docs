---
icon: key
---

# Signing commits

To make the project as secure as possible, signed commits are now required to contribute to the project. Using signatures for commits on GitHub serves several important purposes:

- **Authentication**: it verifies the authenticity of the commit, ensuring that it was indeed made by the person claiming to have made it.
- **Integrity**: it ensures that the commit hasn't been tampered with since it was signed. Any changes to the commit after it has been signed will invalidate the signature.
- **Trust**: this ensures that all contributions come from trusted sources.
- **Visibility**: on GitHub, signed commits are marked with a "verified" label, giving users and collaborators confidence in the commit's origin and integrity.

GitHub offers [an official documentation](https://docs.github.com/fr/authentication/managing-commit-signature-verification/signing-commits) on the matter that can be followed to setup and sign commits properly. Exegol's documentation will sum it up briefly and link to it whenever it's needed.

While **SSH (+ FIDO2)** is preferred since it offers better multi-factor signing capabilities (knowledge + hardware possession factors), people that don't have the required hardware can proceed with GPG or SSH.

::: tabs
== GPG

Generating a GPG key can be done by following GitHub's official documentation on the matter ([generating a new GPG key](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key)). TL;DR, the commands look something like this:

```bash
# for the email, indicate your public email (ID+Name@users.noreply.github.com) from https://github.com/settings/emails
gpg --quick-generate-key "YOUR_NAME <ID+Name@users.noreply.github.com>" ed25519 sign 0
gpg --list-secret-keys --keyid-format=long
gpg --armor --export $KEYID
```

Once the GPG key is generated, it can be added to the contributor's GitHub profile. Again, GitHub's documentation explains how to achieve that ([adding a GPG key to your GitHub account](https://docs.github.com/en/authentication/managing-commit-signature-verification/adding-a-gpg-key-to-your-github-account)).

Once the GPG key is generated and associated to the GitHub account, it can be used to sign commits. In order to achieve that, the contributor must configure `git` properly on his machine ([telling git about your GPG key](https://docs.github.com/en/authentication/managing-commit-signature-verification/telling-git-about-your-signing-key)).

TL;DR: the commands look something like this to set it up for `git` CLI:

```bash
gpg --list-secret-keys --keyid-format=long
git config --global user.signingkey $KEYID

# (option 1) configure locally on a specific repo
cd /path/to/repository && git config commit.gpgsign true

# (option 2) configure for all git operations
git config --global commit.gpgsign true
```

To set it up on IDEs, proper official documentations can be followed (e.g. [GitKraken](https://help.gitkraken.com/gitkraken-client/commit-signing-with-gpg/#configure-gpg-in-gitkraken), [PyCharm](https://www.jetbrains.com/help/pycharm/set-up-GPG-commit-signing.html#enable-commit-signing)).

== SSH

Generating an SSH key can be done by following GitHub's official documentation on the matter ([generating a new SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)). TL;DR, the commands look something like this:

```bash
# for the email, indicate your public email (ID+Name@users.noreply.github.com) from https://github.com/settings/emails
ssh-keygen -t ed25519 -C "YOUR_NAME <ID+Name@users.noreply.github.com>"
```

Once the SSH key is generated, the public part can be added to the contributor's GitHub profile. Again, GitHub's documentation explains how to achieve that ([adding a new SSH key to your GitHub account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)).

Once the SSH key is generated and associated to the GitHub account, it can be used to authenticate and sign commits. In order to achieve that, the contributor must configure `ssh` and `git` properly on his machine ([telling git about your SSH key](https://docs.github.com/en/authentication/managing-commit-signature-verification/telling-git-about-your-signing-key#telling-git-about-your-ssh-key)).

TL;DR: the commands look something like this:

>[!SUCCESS]
> The `git` client version must be 2.34 or later.

```bash
# if setting up for the first time, configure git
git config --global user.name "YOUR_NAME"
# for the email, indicate your public email (ID+Name@users.noreply.github.com) from https://github.com/settings/emails
git config --global user.email "ID+Name@users.noreply.github.com"

git config --global gpg.format ssh
# replace the public key path if needed, below is an example
git config --global user.signingkey "$HOME/.ssh/id_ed25519.pub"

# configure git to sign commits and tags by default
git config --global commit.gpgsign true
git config --global tag.gpgsign true

# verify commits locally, associate SSH public keys with users
mkdir -p ~/.config/git
echo "$(git config --get user.email) $(cat ~/.ssh/id_ed25519.pub)" | tee ~/.config/git/allowed_signers
git config --global gpg.ssh.allowedSignersFile "$HOME/.config/git/allowed_signers"
```

The SSH connection can then be tested as follows ([testing your SSH connection](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection)).

```bash
# load the SSH agent into the current shell
eval "$(ssh-agent -s)"

# test the SSH authentication to GitHub servers
ssh -T git@github.com
```

== SSH (+ FIDO2)

This part of the doc explains how to setup and use FIDO2 security keys, such as YubiKeys, Google's Titan, etc.

First of all, a new FIDO2 key can be configured as follows to set up a PIN.

```bash
# list FIDO2 devices
fido2-token -L

# set a PIN for the device
fido2-token -S $device
```

Then, a [resident key](https://developers.yubico.com/WebAuthn/WebAuthn_Developer_Guide/Resident_Keys.html) can be created and stored on the YubiKey as follows (see [Yubico's documentation](https://www.yubico.com/blog/github-now-supports-ssh-security-keys/)).

>[!SUCCESS]
> Some FIDO2 keys (e.g. recent YubiKeys, and probably others) support **resident keys**. A resident key is stored on the hardware key itself and easier to import to a new computer because it can be loaded directly from the security key. In order to use that feature, the `-O resident` option can be added to the `ssh-keygen` command chosen below.

```bash
# (default) touch only
ssh-keygen -t ed25519-sk

# PIN + touch
ssh-keygen -t ed25519-sk -O verify-required

# nothing (could be unsupported by some OpenSSH clients)
ssh-keygen -t ed25519-sk -O no-touch-required

# PIN (could be unsupported by some OpenSSH clients)
ssh-keygen -t ed25519-sk -O verify-required -O no-touch-required
```

Once the SSH key is generated, the public part can be added to the contributor's GitHub profile. GitHub's documentation explains how to achieve that ([adding a new SSH key to your GitHub account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)).

Once a key is created and added on GitHub, it can be added to the contributor's machine SSH environment as follows. This is as easy as copy-pasting the public and private key parts to `~/.ssh`.

>[!SUCCESS]
> If you opted for a **resident key** setup, the SSH key can be loaded from the hardware key itself.
>
> Note that those steps shouldn't be needed when the key has just been created, as the keys should automatically be added to `~/.ssh`. The commands below are mostly relevant when using **existing** resident keys on **a new system**.
> 
> ```bash
> # temporary
> # needs to be done again after a reboot
> ssh-add -K
> 
> # permanent
> # will download the private and public resident security keys in the current directory
> # private key is to be moved in ~/.ssh (physical FIDO2 key will always be needed)
> ssh-keygen -K
> # it's on purpose, the "_rk" part is removed, otherwise it doesn't work.
> mv id_ed25519_sk_rk ~/.ssh/id_ed25519_sk
> mv id_ed25519_sk_rk.pub ~/.ssh/id_ed25519_sk.pub
> ```
> 
> >[!WARNING]
> >While the `ssh-keygen -K` command saves names files `id_ed25519_sk_rk[.pub]`, it's on purpose the `_rk` part is then removed on the host. Otherwise, SSH fails at handling the keys. The files must be named `id_ed25519_sk[.pub]` on the system.

Once the SSH environment is ready, `git` CLI can be configured to rely on the security key for signing commits and authenticating ([telling git about your SSH key](https://docs.github.com/en/authentication/managing-commit-signature-verification/telling-git-about-your-signing-key#telling-git-about-your-ssh-key)).

>[!SUCCESS]
> The `git` client version must be 2.34 or later.

```bash
# if setting up for the first time, configure git
git config --global user.name "YOUR_NAME"
# for the email, indicate your public email (ID+Name@users.noreply.github.com) from https://github.com/settings/emails
git config --global user.email "ID+Name@users.noreply.github.com"

git config --global gpg.format ssh
# replace the public key path if needed, below is an example
git config --global user.signingkey "$HOME/.ssh/id_ed25519_sk.pub"

# configure git to sign commits and tags by default
git config --global commit.gpgsign true
git config --global tag.gpgsign true

# verify commits locally, associate SSH public keys with users
mkdir -p ~/.config/git
echo "$(git config --get user.email) $(cat ~/.ssh/id_ed25519_sk.pub)" | tee ~/.config/git/allowed_signers
git config --global gpg.ssh.allowedSignersFile "$HOME/.config/git/allowed_signers"
```

The SSH connection can then be tested as follows ([testing your SSH connection](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection)).

```bash
# load the SSH agent into the current shell
eval "$(ssh-agent -s)"

# test the SSH authentication to GitHub servers
ssh -T git@github.com
```

:::

>[!SUCCESS]
> The contributor's GitHub account can be configured to mark unsigned commits as unverified or partially verified. While it's not mandatory regarding contributions to Exegol since the requirement is managed on Exegol repositories directly, it's a nice thing to do. See GitHub's documentation on [Vigilante mode](https://docs.github.com/en/authentication/managing-commit-signature-verification/displaying-verification-statuses-for-all-of-your-commits).
