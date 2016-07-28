set :stage, :h3staging

server '54.152.56.81', user: 'root', port: 22

set :deploy_to, '/opt/cantemo/portal/ubiquity-cantemo-theme'

set :branch, 'h3-dev'

role :serverroot, "root@54.152.56.81:22"

# grunt task before you deploy (dosnt matter as this is local still need to push changes to h3-dev branch);
namespace :stargin_foreman do
  desc "grunt build before deploying"
  task :grunt_build do
    sh "grunt"
  end
  desc "git add all changed files and unstaged and commit"
  task :git_smart do
    sh "git add ."
    sh "git add -u"
    sh "git commit -m 'Cap auto commit'"
  end
  desc "git push to h3-dev"
  task :git_push do
    sh "git push origin h3-dev"
  end
end

before "deploy:starting", 'stargin_foreman:grunt_build'
before "deploy:starting", 'stargin_foreman:git_smart'
before "deploy:starting", 'stargin_foreman:git_push'

# after :finishing, 'deploy:copytheme'
namespace :foreman do
  desc "remove old theme files"
  task :rm_old do
  	on roles(:serverroot) do
    	execute "rm -rf -R /opt/cantemo/portal/portal_themes/mdl/"
    	execute "rm -rf -R /opt/cantemo/portal/portal_media/mdl/"
    end
  end
  
  desc "copy files to cantemo directories theme directories"
  task :copy_new do
  	on roles(:serverroot) do
    	execute "cp -R #{ deploy_to }/current/portal_themes/mdl /opt/cantemo/portal/portal_themes/"
    	execute "cp -R #{ deploy_to }/current/portal_media/mdl /opt/cantemo/portal/portal_media/"
    end
  end
  
  desc "chown moved files"
  task :chwon do 
  	on roles(:serverroot) do
  		execute "chown -R www-data:www-data /opt/cantemo/portal/portal_themes/mdl"
  		execute "chown -R www-data:www-data /opt/cantemo/portal/portal_media/mdl"
  	end
  end

  desc "restart cantemo portal"
  task :restart_server do
  	on roles(:serverroot) do
  		execute "cd /opt/cantemo/portal/"
  		execute "supervisorctl restart portal"
  	end
  end
end

after 'deploy:finished', 'foreman:rm_old'
after 'deploy:finished', 'foreman:copy_new'
after 'deploy:finished', 'foreman:chwon'
after 'deploy:finished', 'foreman:restart_server'
