package com.looteria.service;

import com.looteria.dto.UserDTO;
import com.looteria.entity.User;
import com.looteria.entity.UserRole;
import com.looteria.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public User registerUser(String email, String nombreUsuario, String contrasena) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("El email ya está registrado");
        }
        if (userRepository.existsByNombreUsuario(nombreUsuario)) {
            throw new RuntimeException("El nombre de usuario ya está en uso");
        }

        User nuevoUsuario = new User();
        nuevoUsuario.setIdUsuario(null);
        nuevoUsuario.setEmail(email);
        nuevoUsuario.setNombreUsuario(nombreUsuario);
        nuevoUsuario.setContrasena(contrasena);
        nuevoUsuario.setRol(UserRole.REGISTRADO);
        
        return userRepository.save(nuevoUsuario);
    }
    
    public User loginUser(String email, String contrasena) {
        Optional<User> usuarioOpt = userRepository.findByEmail(email);
        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado");
        }
        return usuarioOpt.get();
    }
    
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
    
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public long countUsers() {
        return userRepository.count();
    }

    /**
     * Obtener todos los usuarios como DTOs
     */
    public List<UserDTO> getAllUsersDTO() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtener usuario por ID como DTO
     */
    public UserDTO getUserByIdDTO(Long id) {
        return userRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

    /**
     * Eliminar usuario por ID
     */
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public UserDTO updateUserAdmin(Long id, String email, String nombreUsuario, String rol, String ubicacion,
                                   BigDecimal reputacionMedia, Boolean verificadoIdentidad) {
        User usuario = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String normalizedEmail = email != null ? email.trim() : null;
        String normalizedNombreUsuario = nombreUsuario != null ? nombreUsuario.trim() : null;

        if (normalizedEmail == null || normalizedEmail.isEmpty()) {
            throw new RuntimeException("El email es obligatorio");
        }
        if (normalizedNombreUsuario == null || normalizedNombreUsuario.isEmpty()) {
            throw new RuntimeException("El nombre de usuario es obligatorio");
        }
        if (rol == null || rol.trim().isEmpty()) {
            throw new RuntimeException("El rol es obligatorio");
        }

        if (!normalizedEmail.equals(usuario.getEmail()) && userRepository.existsByEmail(normalizedEmail)) {
            throw new RuntimeException("El email ya está registrado");
        }
        if (!normalizedNombreUsuario.equals(usuario.getNombreUsuario()) && userRepository.existsByNombreUsuario(normalizedNombreUsuario)) {
            throw new RuntimeException("El nombre de usuario ya está en uso");
        }

        usuario.setEmail(normalizedEmail);
        usuario.setNombreUsuario(normalizedNombreUsuario);
        usuario.setRol(UserRole.valueOf(rol.trim()));
        usuario.setUbicacion(ubicacion != null ? ubicacion.trim() : null);
        usuario.setReputacionMedia(reputacionMedia != null ? reputacionMedia : BigDecimal.ZERO);
        usuario.setVerificadoIdentidad(Boolean.TRUE.equals(verificadoIdentidad));

        return convertToDTO(userRepository.save(usuario));
    }

    /**
     * Actualizar usuario
     */
    public User updateUser(User user) {
        return userRepository.save(user);
    }

    /**
     * Convertir entidad User a DTO
     */
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setIdUsuario(user.getIdUsuario());
        dto.setEmail(user.getEmail());
        dto.setNombreUsuario(user.getNombreUsuario());
        dto.setRol(user.getRol().toString());
        dto.setFechaRegistro(user.getFechaRegistro());
        dto.setUbicacion(user.getUbicacion());
        dto.setPuntosAcumulados(user.getPuntosAcumulados());
        dto.setVerificadoIdentidad(user.getVerificadoIdentidad());
        dto.setReputacionMedia(user.getReputacionMedia());
        return dto;
    }
}
