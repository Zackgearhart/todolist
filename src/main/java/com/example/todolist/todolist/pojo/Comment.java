package com.example.todolist.todolist.pojo;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name="comments")
public class Comment {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name="comment_id")		
	private int id;
	
	@ManyToOne
	@JoinColumn(name="comment_user_id", nullable = false)
	private User user;
	
	@ManyToOne
	@JoinColumn(name="comment_post_id", nullable = false)
	private Post post;
	
	@Column(name="comment_text")
	private String content;
	
	@Column(name="comment_date")
	private Date date;

	@Transient
	private boolean editable;


	public boolean isEditable() {
		return editable;
	}

	public void setEditable(boolean editable) {
		this.editable = editable;
	}

	public int getId() {
		return id;
	}

	public User getUser() {
		return user;
	}

	public Post getPost() {
		return post;
	}

	public String getContent() {
		return content;
	}

	public Date getDate() {
		return date;
	}

	public void setId(int id) {
		this.id = id;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public void setPost(Post post) {
		this.post = post;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public void setDate(Date date) {
		this.date = date;
	}
}