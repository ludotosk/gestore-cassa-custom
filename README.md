# [Custom](https://www.custom.biz/it_IT/prodotti/registratori-di-cassa) cash register remote web controller
With this server, you can control your Custom cash register present in the local area network
## Feature
* automated connection to the cash registry
* local database (for sold items)
* product database (without the need to set the products in the cash registry)
* it works on every device also cellphones
* encryption of the communication between client and server
* can run in less than 100 Mb of ram
* authentication
### A video where I show to a friend of mine how the login works and some interface features
[![Watch the video](https://lh3.googleusercontent.com/FaF4OsCMVmLWXKnugf77A7-u4ry_9ky7wxZ7Lnj43Nz5OHYJiJNrk4zeAQFBgSqjUDMObkpqupU7_P6uGMXPiCPZMwBdS_aZTdVhwFQMfpoVx7LSKpaoEKA7x_r7t3knAtW7APhODpk=w2400)](https://lh3.googleusercontent.com/TtIsnlRZNLT1oEbFV7WhmPZVnLpQYZgMt5k-wcknc8mi5M6gwqNoQaXoHId7K5xi_2H5LFlaSjy_LZkui0jVKhreMBl_x5bbtXdooG0lfQrtwYzUdt4wq8Ro-ozMQheVYOuYgOz8DJQ=w2400)
## How does the automated connection work?
Unfortunately, the javascript application can see only the IP address and not the mac address, so I used Evilscan to search all the clients in the local network, and then I read the header to see whether or not is the webserver of the cash registry. In case of failure of this process the operator is able to insert the IP of the cash registry manually.
### Is safe the usage of this method?
After the server establishes the connection with the cash registry the cash registry notifies the connection so it's safe.
### What happens if someone tries to do a man-in-the-middle attack?
I can't prevent this issue because the connection between the cash registry and the server isn't encrypted. So is not in my capability.
## Local database
I realized a database in the server because even if the cash registry saves all the data in his database with my database I'm able to perform analysis and also there is room for feature improvements in the future.
### Why I don't use the product database of the registry?
I made this choice because is simpler to add items to the server than add in the registry, and I want to make it possible to perform less operations in the registry as possible.
## How did I implement cryptography over HTTP?
I expose an HTTP page with an RSA 4096 bit key that the client read, then the client sends an encrypted message to the server with an aes256 key that is used in the rest of communication. After the key exchange, I encrypt all the data in the body of the HTTP message. So the AES key is generated for each communication, while the RSA key is generated by the server at the first boot.
## How does the authentication work?
The client to authenticate uses one 4 digit code that the server print in the home directory, after the client makes the authentication the server make on a json web token that is necessary for each communication with the server. I decided to print the code in the home directory because if the server is running on the same computer as the client the user can read it, but the true reason why I chose a code is that you can run this server on raspberry with a 16 chars screen.
## How is possible to have such a light server?
Because tanks to Vue I'm able to client side render the web interface and for the database, I have chosen SQLite. So the server works only to send and receive data from the client and to send static assets like HTML, CSS etc.