package frc.bd.controller;

import frc.bd.model.User;
import frc.bd.dto.UserDTO;
import frc.bd.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public UserDTO getUserById(@PathVariable String id) {
        User user = userService.findById(id).orElseThrow();
        return new UserDTO(user.getId(), user.getUsername(), user.getEmail());
    }
}
