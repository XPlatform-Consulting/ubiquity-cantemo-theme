set :stage, :h3staging

server 'http://ec2-54-152-56-81.compute-1.amazonaws.com/', roles: %w{web}, port: 22

set :deploy_to, '/opt/cantemo/portal'

set :branch, 'h3-develop'
