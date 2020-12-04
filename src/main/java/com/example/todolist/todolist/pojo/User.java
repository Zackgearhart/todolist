package com.example.todolist.todolist.pojo;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="users")
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name="user_id")
	
	private int id;
	
	@Column(name="username")
	private String name;
	
	@Column(name="password")
	private String passwordHashed;
	
	@Column (name="user_email")
	private String email;
	
	@Column (name="enabled")
	private Boolean enabled;

	public int getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public String getPasswordHashed() {
		return passwordHashed;
	}

	public String getEmail() {
		return email;
	}

	public Boolean getEnabled() {
		return enabled;
	}

	public void setId(int id) {
		this.id = id;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setPasswordHashed(String passwordHashed) {
		this.passwordHashed = passwordHashed;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public void setEnabled(Boolean enabled) {
		this.enabled = enabled;
	}
}