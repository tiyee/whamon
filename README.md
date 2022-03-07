# whamon

A blog system wrote by ES6 and powered by original Node.js without any framework.


## Install

1.  `yarn install`

2.  `yarn pro ` or  `yarn dev`


## Import mysql

Database  must be configured before start this application.


1. Exec sqlscript in ./angemon.sql

2. Configure config file in ./config dir

## Nginx location

```

 location  = / {
            proxy_pass http://127.0.0.1:3000/;

        }
        location  ~* ^/post/([0-9a-z]+)\.html$ {
            proxy_pass http://127.0.0.1:3000/post?id=$1;

        }
        location ~ ^/tag {
            if ($request_uri ~* ^/tag/(.*)\.html$) {
                proxy_pass http://127.0.0.1:3000/tag?id=$1;
            }
        }
```

## Run

`node ./srcipts/index.js` or `yarn start`

# Example

I just want to create it to rebuild my blog by node.js , you can visit [www.tiyee.net](https://www.tiyee.net/?fr=wha).   
I have started a server in [whamon.tiyee.cn](https://whamon.tiyee.cn/?fr=wha).

