package com.example.biblio.service;

import com.example.biblio.model.Role;
import com.example.biblio.model.User;
import com.example.biblio.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserRepository userRepository;

    @Override
    public User addUser(User user, Role role) {
        return userRepository.save(user);
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).get();
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User editUserRole(Integer userId, Role newRole) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setRole(newRole); // Update user role
            return userRepository.save(user);
        } else {
            // Throw an exception or handle error for user not found
            throw new RuntimeException("User not found with ID: " + userId);
        }
    }
}
