package com.looteria.repository;

import com.looteria.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByNombreUsuario(String nombreUsuario);

    boolean existsByEmail(String email);

    boolean existsByNombreUsuario(String nombreUsuario);

    Iterable<User> findByVerificadoIdentidad(Boolean verificadoIdentidad);

    long countByVerificadoIdentidad(Boolean verificadoIdentidad);

    List<User> findAllByActivoTrue();

    Optional<User> findByEmailAndActivoTrue(String email);

    Optional<User> findByIdUsuarioAndActivoTrue(Long idUsuario);
}
