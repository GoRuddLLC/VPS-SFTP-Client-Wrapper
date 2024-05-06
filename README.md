# Virtual Private Server Simple File Transfer Protocol API Wrapper

The sole intent of this repository is to create a loadbalancer and SFTP to establish the connection between our GoRudd web server to a VPS for our React Expo building service via SSH2.

## Project Architecture 
`load balancer` - This will find the server that is the least occupied and use it to build the expo project. 