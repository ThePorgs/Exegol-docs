# Installing Exegol on Qubes OS 

> [!NOTE]
> This setup makes it possible to install and use Exegol inside Qubes OS. However, the Exegol team is still exploring more efficient ways to integrate it seamlessly within the Qubes architecture. 
> We’d really appreciate your feedback and testing results on the official Exegol Discord to help us improve this process and make it easier for everyone.

Exegol is installed through two main steps:

1. Install the Python wrapper (the "brains")
2. Install at least one Exegol image (the "muscle")

## 1. QubesOS TemplateVM setup

>In this process, we will create a TemplateVM and install Git, Docker, Pipx, and the Exegol wrapper. After that, we will create an AppVM that uses the image from the TemplateVM.

Opening the dom0 terminal

```[QubesOS start menu] → Gear icon → [Other] → Xfce Terminal```

List templates (Dom0):

```bash
qvm-ls --class TemplateVM
```

Clone the template (Dom0):

```bash
qvm-clone debian-13-xfce debian-13-exegol
```

where debian-13-exegol will be the name of our new template. You can also use the standard template if you want to save space.

Temporarily connect the template to the internet (Dom0):

```bash
qvm-prefs debian-13-exegol netvm sys-firewall 

### After finishing the entire process, disconnect it
qvm-prefs debian-13-exegol netvm ""
```

Increase the template volume size to be able to install the full image (Dom0):

```bash
qvm-volume resize debian-13-exegol:root 90Gi
```

 Then start the template:

```bash
qvm-start debian-13-exegol &
```

Open the terminal of the template **debian-13-exegol** (Dom0):

```bash
qvm-run -a debian-13-exegol xfce4-terminal  
```
> Just make sure to wait for all services to start.
---
## 2. QubesOS template setup for Git, Pipx, Docker, and the Exegol wrapper

Install Git and pipx (Inside debian-13-exegol template):

```bash
sudo apt update && sudo apt install -y git python3 pipx
```

Ensure pipx is in PATH and reload the shell (Inside debian-13-exegol template):

```bash
pipx ensurepath && exec $SHELL 
```

Install Docker and CLI tools (inside debian-13-exegol template):

>While we always advise to refer to the [official documentation](https://docs.docker.com/engine/install/), the following one-liner can be used to install Docker quickly.

```bash
curl -fsSL "https://get.docker.com/" | sh
```

Once docker is installed, it needs to be started (Inside debian-13-exegol template):

```bash
# start docker
sudo systemctl start docker 

# configure docker to start at boot
sudo systemctl enable --now docker
```

Install exegol wrapper (inside debian-13-exegol template):

```bash
pipx install exegol
```

Create a alias to run Exegol with `sudo` while keeping your user environment:

```bash
echo "alias exegol='sudo -E $(echo ~/.local/bin/exegol)'" >> ~/.bash_aliases && source ~/.bash_aliases
```

Install the exegol image:

```bash
exegol install free 
```

Create some containers for persistence on the AppVM:

```bash
exegol start container1 --desktop
exegol start container2 --desktop
exegol start container3 --desktop
```


> [!NOTE]
>  Due to the isolation nature of Qubes OS, a container created inside an AppVM will not survive after shutdown. However, if you create it inside the TemplateVM, it can be accessed from the AppVM, and it will be persistent but will not share the same /workspace; in other words, it will be completely isolated. Anything written to the /workspace of the AppVM will remain there only. You can always go back and create a new container on the TemplateVM depending on your needs. This behavior is by design in Qubes OS, ensuring strict isolation between AppVMs and templates.

---
## 3. Creating the AppVM for using exegol


> [!NOTE]
> This process can also be done through the GUI using:
> 
> [Qubes OS start menu] → Gear icon → [Qubes Tools] → + Create New Qube
> 
> Just make sure that for every new Exegol AppVM, you ensure the pipx path is set, install the wrapper, and add the sudo alias to grant Exegol the required permissions.

Shutdown the template for applying config (Inside Dom0 terminal):

```bash
qvm-shutdown debian-13-exegol
```

Create the AppVM (Dom0):

```bash
qvm-create --class AppVM --template debian-13-exegol --label red exegol-appvm
```

Start the terminal in the AppVM (Dom0):

```bash
qvm-run -a exegol-appvm xfce4-terminal
```

Ensure pipx is in PATH and reload the shell (inside exegol-appvm):

```bash
pipx ensurepath && exec $SHELL
```

Wrapper install (inside **exegol-appvm**):

```bash
pipx install exegol 
```

Add the following alias to your `~/.bashrc` file (inside exegol-appvm):

```bash 
echo "alias exegol='sudo -E $(echo ~/.local/bin/exegol)'" >> ~/.bash_aliases && source ~/.bash_aliases
```

Download resources:

```bash
exegol update
```

Start the already created container on the TemplateVM:
 
```bash
exegol start container1
```

> If you encounter an error, simply create the /workspaces directory for the desired container:

```bash
mkdir -p /home/user/.exegol/my-resources
mkdir -p /home/user/.exegol/workspaces/container1
mkdir -p /home/user/.exegol/exegol-resources
```

In case you forget your password, just type:
```bash
passwd <newpassword>
```
>You can access the --desktop mode normally inside the AppVM.

---
## 4. Network configuration

To route all traffic from your exegol-appvm through Tor (inside Dom0):

```bash
qvm-prefs exegol-appvm netvm sys-whonix
```

Confirm the change:

```bash
qvm-prefs exegol-appvm netvm
# Output should be: sys-whonix
``` 
>Inside the AppVM or exegol container, verify your connection at: https://check.torproject.org

To completely block network access for the AppVM:

```bash
qvm-prefs exegol-appvm netvm ''
```
>This detaches the VM from any NetVM, keeping it fully isolated and offline.

 To use the normal Qubes routing chain (AppVM → sys-firewall → sys-net → Internet):
 
```bash
qvm-prefs exegol-appvm netvm sys-firewall
```
>This is the recommended configuration for most use cases.

To route traffic directly, bypassing the Qubes system firewall:
```bash
qvm-prefs exegol-appvm netvm sys-net
```

> [!WARNING]
> This exposes the AppVM more directly to the network stack and is not recommended unless you have a specific need (e.g., packet sniffing, network debugging, or VPN gateway setup).

>For more advanced configurations, check the [QubesOS official documentation](https://doc.qubes-os.org/en/latest/user/security-in-qubes/firewall.html)

---
## 5. The rest

Once the requirements are installed, the main installation documentation can be followed, from [step "3. Activation"](/first-install#_3-activation).





