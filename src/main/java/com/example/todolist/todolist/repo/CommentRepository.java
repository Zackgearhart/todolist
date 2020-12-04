package com.example.todolist.todolist.repo;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;

import com.example.todolist.todolist.pojo.Comment;
import com.example.todolist.todolist.pojo.Post;

public interface CommentRepository extends PagingAndSortingRepository<Comment, Integer> {
	public List<Comment> findAll();

	public List<Comment> findAllByPostOrderByDateAsc(Post post);
}
