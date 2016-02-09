# MDL based Cantemo theme
Author: Jared Smith <jared@highwaythreesolutions.com>

# Requirements
* Tested with Cantemo Portal: `2.3.0-devel-101`
* MDL version: `1.1.1`

# Setup
## Install mdl
```
cd portal_media/mdl
bower install material-design-lite#1.1.1 --save
```

## Cantemo
### Installing
Upload mdl root to the server
```
# Use the cmds below to install the theme
sudo cp -rp ~/mdl/portal_media/mdl /opt/cantemo/portal/portal_media/
sudo cp -p ~/mdl/portal_media/css/portal-mdl.css /opt/cantemo/portal/portal_media/css/
sudo cp -pr ~/mdl/portal_themes/mdl /opt/cantemo/portal/portal_themes

## For cantemo to use the theme, permissions must be corrected
sudo chown -R www-data:www-data ~/mdl/portal_media/mdl /opt/cantemo/portal/portal_media/
sudo chown www-data:www-data ~/mdl/portal_media/css/portal-mdl.css /opt/cantemo/portal/portal_media/css/
sudo chown -R www-data:www-data ~/mdl/portal_themes/mdl /opt/cantemo/portal/portal_themes
```
### Removing
```
sudo rm -rf /opt/cantemo/portal/portal_media/mdl
sudo rm -f /opt/cantemo/portal/portal_media/css/portal-mdl.css
sudo rm -rf /opt/cantemo/portal/portal_themes/mdl
```

# License
TBD
