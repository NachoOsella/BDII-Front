package frc.bd.repository;

import frc.bd.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username); // devuelve un usuario cuyo nombre de usuario coincida con el valor dado.
    Optional<User> findByEmail(String email); // devuelve un usuario cuyo email coincida con el valor dado.
    Optional<User> findByUsernameOrEmail(String username, String email); // devuelve un usuario cuyo nombre de usuario o email coincida con alguno de los valores dados.
}
