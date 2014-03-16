class Guest < ActiveRecord::Base
  attr_accessible :email, :phone,:name,:num_of_friends, :host_id
  attr_accessor :host_id

  has_many :invites
end
