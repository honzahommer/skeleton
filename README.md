# skeleton
> Grunt workflow for HTML development.


## Installation (Linux)

```sh
wget -qO- https://raw.githubusercontent.com/honzahommer/skeleton/master/bin/install | bash

```

### Step-by-step

Install Node Version Manager (recommended):

```sh
wget -qO- https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash

```

Install latest version of Node:

```sh
nvm install `nvm version-remote`
```

Clone repository and change directory:

```sh
git clone https://github.com/honzahommer/skeleton.git html-skeleton
cd $_
```

Install Grunt environment and show available tasks:

```sh
npm install
```

## Environment variables

```sh
DEBUG=false           # Allow debug
MINIFY=false          # Minify JS and CSS
INLINE=false          # Make CSS, JS and images inline
PATH_PUB=public       # Public (builded) files directory
PATH_NPM=node_modules # Node modules directory
PATH_SRC=src          # Sources directory
PATH_TMP=tmp          # Temporary files directory
HOSTNAME=localhost    # Hostname used for local dev server
SITENAME=Skeleton     # Site name
```

## Local development

Install environment and run Grunt **serve** task (task includes local server
and reload browser on any source change):

```sh
grunt serve
```

## Build sources

To build sources run Grunt **build** task:

```sh
grunt build
```

## Default skeleton directory structure

```sh
└── public                      # builded sources
└── src
    ├── fonts
    ├── img
    ├── js
    │   └── main.js             # base JavaScript file
    ├── less
    │   ├── main.less           # base Less file
    │   └── vendor
    │       └── bootstrap.less  # Bootstrap skeleton
    └── tpl
        ├── index.html
        └── partials
            ├── footer.html
            └── header.html
```

## Todo

- [ ] [App.js](https://github.com/honzahommer/app-js)
- [ ] [Handlebars](http://assemble.io/)
