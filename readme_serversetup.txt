How to set up a Server & Stream Video into dcl.

*this is thanks to Nicolas Earnshaw & the following links:

LINK1: DCL GUIDE https://github.com/decentraland-scenes/video-streaming
LINK2: DCL ADVANCED GUIDE https://github.com/decentraland-scenes/video-streaming/blob/main/ADVANCED-SETUP.md
LINK3: DIGITAL OCEAN https://www.digitalocean.com/
LINK4: PUTTY https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html
LINK5: NVM https://github.com/nvm-sh/nvm
LINK6: Node-Media-Server https://github.com/illuspas/Node-Media-Server
LINK7: PM2 https://www.npmjs.com/package/pm2
LINK8: md5 hash https://www.md5hashgenerator.com/
LINK9: Unix Timestamp https://www.unixtimestamp.com/

00: Digital Ocean

Create an account.
Create a new project and a new droplet.
Settings to note: Debian; Basic Plan; any CPU option; any storage option; datacenter by proximity; in Additional Options, add monitoring; in Authentication, set root password; Create droplet.

01: Domain Name

Use nip.io - if your server's IP is 10.100.10.100 then the following domain should route to your server: 10-100-10-100.nip.io.

02: Connect to Server

Use putty - enter IP address with port 22; enter root for username; enter password set previously.

03: Install Command Line Tools

Update: apt-get update
Install curl & git: apt install curl git (respond 'Yes' to questions on the wizard).
//curl is to run requests to external servers.
//git is for version control.
Install NVM (Node Version Manager): curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
Once NVM is installed, paste and run the last 3 lines printed onto the terminal (alternatively you can restart the terminal and it will load NVM each time you connect).
Install nodejs version 14: nvm install 14
Install Node-Media-Server: 

mkdir nms
cd nms
npm install node-media-server

//The most tricky part but at the moment the app.js file is already setup so no need to troubleshoot anymore. Otherwise, illuspas' github page contains most of the info. 
Change directory to newly installed Node-Media_Server directory: cd nms/
Install necessary packages: npm install
Install globally pm2: npm i -g pm2 
//pm2 is a process manager that allows you to keep running the program even after you quit terminal.
Install ffmpeg: apt install ffmpeg (respond 'Yes' to questions on the wizard).
//ffmpeg is for processing media.

04: Edit app.js

Within node-media-directory run: nano app.js
//Nano is a basic text editor.
//The app.js file contains your stream configuration.
The app.js file should look like the file included.

05: Start the App

Run: pm2 start app.js
Check applications running: pm2 ls
Check errors: pm2 log 0 (0 is the process id of the running program, this number may vary depeding on processes running - more info here: https://pm2.keymetrics.io/docs/usage/quick-start/)
Commands: pm2 stop 0; pm2 start 0; pm2 restart 0.

06: Install nginx & certbot

Install nginx & certbot: apt install nginx certbot
//nginx is used to handle the http video call request from the user. 
//certbot is used to create an SSL certificate for the nginx server (padlock icon on the address bar in your browser).
Check if running: systemctl status nginx
Open: <ip-address>.nip.io
Install nginx plugin for certbot: apt install nginx certbot python3-certbot-nginx
//You can search for packages by name if you run: apt search nginx certbot

07: certbot

//this part may be outdated now, problematic...

Run: certbot run --nginx -d <ip-address>.nip.io
Enter your email address to receive an email for certification expiry. These certificates renew automatically.
Agree to terms of service: 'A'
Don't share email: 'No'
Select to redirect HTTP traffic to HTTPS: '2'
If you refresh browser and check the <ip-address>.nip.io you should have a padlock.

08: Changing nginx Config

Run nano: nano /etc/nginx/sites-enabled/default
Scroll down to HTTPS, which is the SSL config.
Replace 'root /var/ww/html;' with 'root srv/media;'
Add within the braces for location / to enable CORS: 'proxy_pass http://localhost:8000/;'
//This tells any traffic going to the domain <ip-address>.nip.io to use port 8000.
Exit & restart nginx: systemctl restart nginx

09: Run a Stream

Install OBS.
In OBS settings, set the server to: rtmp://<ip-address>.nip.io/live/
Set the stream key to anything.
We earlier set a secret in app.js file. We now need that secret.
On the server terminal run to check if the stream is working: pm2 log 0 -f
It should show unauthorised.
To create a stream key we need to create an md5 hash in the following format: /live/<nameofstream>-<unixtimestampforduration>-<secret>
Back in OBS, the stream key will be: <nameofstream>?sign=<unixtimestamp>-<md5hash>
Apply.
Stream.
Verify1: OBS should say live.
Verify2: run: pm2 log 0 -f (it should read rtmp connect, rtmp play, rtmp publish).
Run: mpv https://<ip-address>.nip.io/live/<nameofstream>/index.m3u8 (you should see the stream, but didn't work for me).
This is the link to paste within your dcl scene: https://<ip-address>.nip.io/live/<nameofstream>/index.m3u8

10: Troubleshooting

I had a problem with the droplet running out of disk space.
To see storage breakdown,
Run: df -h
To see in more detail, install ncdu.
Run: apt-get install ncdu
Run: ncdu /
Navigating is self-explanatory, delete files with 'd'
'/root/nms/srv/media/live/<name>' - was saving stream media files from each load presumably, proceeded to delete large media.
