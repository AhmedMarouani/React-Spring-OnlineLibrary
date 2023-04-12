package com.example.biblio.service;

import com.example.biblio.model.Role;
import com.example.biblio.model.User;
import org.springframework.stereotype.Service;

import java.util.List;

public interface UserService {
    User addUser(User user, Role role);
    User findByEmail(String email);
    List<User> getAllUsers();
    User editUserRole(Integer userId, Role newRole);
}
