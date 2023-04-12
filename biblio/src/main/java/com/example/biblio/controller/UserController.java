package com.example.biblio.controller;


import com.example.biblio.model.Role;
import com.example.biblio.model.User;
import com.example.biblio.repository.UserRepository;
import com.example.biblio.service.BookService;
import com.example.biblio.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/User")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private BookService bookService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/addUser")
    public User addNewUClient(@RequestBody User user){
        User newUser = userService.addUser(user, Role.CLIENT);
        return newUser;
    }

    @PostMapping("/addSubscriberUser")
    public User addNewSubscriberUser(@RequestBody User user) {
        return userService.addUser(user, Role.CLIENTA);
    }

    @GetMapping("/findByEmail")
    public User findByEmail(@RequestParam("email") String email){
        User UserByEmail = userService.findByEmail(email);
        return UserByEmail;
    }
    @GetMapping("/getAllUsers")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/{userId}/editRole")
    public ResponseEntity<User> editUserRole(@PathVariable Integer userId, @RequestParam Role newRole) {
        try {
            User updatedUser = userService.editUserRole(userId, newRole);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } catch (RuntimeException e) {
            // Handle error for user not found
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}/decreaseDownloadsRemaining")
    public void decreaseDownloadsRemaining(@PathVariable Integer id) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        int downloadsRemaining = user.getDownloadsRemaining();
        if (downloadsRemaining > 0) {
            user.setDownloadsRemaining(downloadsRemaining - 1);
            userRepository.save(user);
        } else {
            throw new IllegalStateException("No downloads remaining for the user");
        }
    }






}
