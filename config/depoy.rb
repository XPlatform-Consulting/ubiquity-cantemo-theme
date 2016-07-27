set :application, "md-theme"

#set repository
set :repository, "git@github.com:XPlatform-Consulting/ubiquity-cantemo-theme.git"

# Default branch is :master
ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }.call

# Default deploy_to directory is /var/www/my_app
set :deploy_to, '/opt/cantemo/portal'

# Default value for :scm is :git
set :scm, :git

set :ssh_options, {
  user: 'www-data',
  forward_agent: true
}

#restart portal after deploy
task :restart_daemons, :roles => :app do
    sudo "supervisorctl restart portal"
  end

# Default value for keep_releases is 5
set :keep_releases, 5

namespace :deploy do
  after :finishing, 'deploy:cleanup'
end