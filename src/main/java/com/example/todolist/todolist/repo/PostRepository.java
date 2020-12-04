package com.example.todolist.todolist.repo;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;

import com.example.todolist.todolist.pojo.Post;

public interface PostRepository extends PagingAndSortingRepository<Post, Integer> {
	public List<Post> findAll();

	public List<Post> findAllByContentContainingOrderByDateDesc(String content, Pageable page);

	public List<Post> findAllByOrderByDateDesc(Pageable page);

	public List<Post> findAllByContentContainingOrderByDateAsc(String text, Pageable page);

	public List<Post> findAllByOrderByDateAsc(Pageable page);

}