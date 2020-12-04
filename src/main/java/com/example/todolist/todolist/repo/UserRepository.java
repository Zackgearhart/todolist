package com.example.todolist.todolist.repo;

import org.springframework.data.repository.PagingAndSortingRepository;

import com.example.todolist.todolist.pojo.User;

public interface UserRepository extends PagingAndSortingRepository<User, Integer> {
	public User findFirstByName(String name);
}
