class HostsController < ApplicationController
  before_filter :correct_host, only: [:edit, :show]
  respond_to :html, :json

  def index
    @hosts = Host.includes(:user).order('created_at DESC').all
  end

  def new
    @host = Host.new
  end

  def show
    @host = Host.find(params[:id])
  end

  def destroy
    @host = Host.find(params[:id])
    @host.destroy
    redirect_to hosts_path
  end

  def edit
    @host = Host.find(params[:id])
  end

  def update
    @host = Host.find(params[:id])
    @host.update_attributes(params[:host])

    if params[:finalStep] && !@host.received_registration_mail
      ZbMailer.registration(@host.user.id)
      @host.update_attributes(received_registration_mail: true)
    end

    respond_with(@host)
  end

  # Checks if user has access to view page
  def correct_host
    meta = current_user.try(:meta)
    id = params[:id].to_i

    return if current_user && current_user.admin?

    
    redirect_to root_path if meta.nil? || (meta.is_a?(Host) && meta.id != id)
    redirect_to root_path if meta.is_a?(Manager) && !meta.hosts.pluck(:id).include?(id)
  end
end
