Configuring and locking down your system's `hosts` file forces your OS to map specific domain names directly to static IP addresses before making any DNS lookup. This prevents DNS hijacking, blocks malicious domains locally, and ensures loopback traffic stays internal.

---

**File Locations**

* **Windows**: `C:\Windows\System32\drivers\etc\hosts`
* **Linux & macOS**: `/etc/hosts`

---

**Clean Default Configurations**

If you suspect your `hosts` file was tampered with by malware (e.g., redirecting security or banking sites to rogue IPs), replace its contents with the default baseline:

* **Default Windows `hosts` File**
```text
# Default Windows Hosts File
127.0.0.1       localhost
::1             localhost

```


* **Default Linux / macOS `hosts` File**
```text
127.0.0.1       localhost
::1             localhost
255.255.255.255 broadcasthost

```



---

**Security Hardening Techniques**

**1. Block Malicious & Telemetry Domains**
Route unwanted domains directly to `0.0.0.0` (non-routable target address). Using `0.0.0.0` is faster and safer than `127.0.0.1` because the OS immediately drops the connection attempt rather than waiting for a local web server timeout.

```text
# Domain Blocking List
0.0.0.0   malicious-phishing-site.com
0.0.0.0   telemetry.tracking-domain.net
0.0.0.0   ads.example.com

```

**2. Lock Local App Domains (Development & Headless Tools)**
Map local development hostnames strictly to loopback addresses so internal API or headless scraper calls do not resolve over the public internet:

```text
# Local Development Bindings
127.0.0.1   local.app
127.0.0.1   api.local

```

---

**How to Edit and Flush DNS**

**On Windows**

1. Open the Start menu, search for **Notepad**, right-click it, and select **Run as Administrator**.
2. Click **File > Open**, navigate to `C:\Windows\System32\drivers\etc\`, switch the file filter from `Text Documents (*.txt)` to `All Files (*.*)`, and select `hosts`.
3. Save your changes.
4. Clear your DNS cache in Command Prompt:
```cmd
ipconfig /flushdns

```



**On Linux / macOS**

1. Open a terminal and open the file with elevated privileges:
```bash
sudo nano /etc/hosts

```


2. Make your edits, press `Ctrl + O` to save, and `Ctrl + X` to exit.
3. Flush your DNS cache:
* **macOS**: `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`
* **Linux (systemd-resolved)**: `sudo resolvectl flush-caches`



---

**Prevent Malware from Modifying the File**

Once your `hosts` file is configured, lock down its file permissions to stop unauthorized software or scripts from adding rogue redirect entries:

* **Windows**: Right-click the `hosts` file -> **Properties** -> Check **Read-only** -> Click **Apply**.
* **Linux**: Set write restrictions:
```bash
sudo chmod 644 /etc/hosts
sudo chattr +i /etc/hosts  # Makes file immutable (cannot be edited even by root without -i)

```


* **macOS**:
```bash
sudo chmod 644 /etc/hosts
sudo chflags uchg /etc/hosts  # Sets immutable flag

```
