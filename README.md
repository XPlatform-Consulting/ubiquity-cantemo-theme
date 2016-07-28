# MDL based Cantemo theme
Authors: Garrett Culos & Jared Smith <jared@highwaythreesolutions.com>

# Requirements
* Tested with Cantemo Portal: `2.3.0-devel-101`
* MDL version: `1.1.1`

# Setup
## Install mdl
``` npm install ```
``` bower install ```

# Compile scss for dev
``` grunt ```

## Cantemo Deployment
You'll need to have your ssh key set in ~/.ssh
### H3Staging
This command will run 'grunt dev' so you dont need to run grunt before deploying
```cap h3stage deploy```


# To do
* add grunt watch
* set up cap deploy for production