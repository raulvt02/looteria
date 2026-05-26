package com.looteria.controller;

import com.looteria.entity.User;
import com.looteria.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerUser(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String nombreUsuario = request.get("nombreUsuario");
            String contrasena = request.get("contrasena");
            String ubicacion = request.get("ubicacion");
            
            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Email requerido"));
            }
            if (nombreUsuario == null || nombreUsuario.isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Nombre de usuario requerido"));
            }
            if (contrasena == null || contrasena.isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Contraseña requerida"));
            }
            
            User usuarioCreado = userService.registerUser(email, nombreUsuario, contrasena, ubicacion);
            
            Map<String, Object> response = new HashMap<>();
            response.put("idUsuario", usuarioCreado.getIdUsuario());
            response.put("email", usuarioCreado.getEmail());
            response.put("nombreUsuario", usuarioCreado.getNombreUsuario());
            response.put("rol", usuarioCreado.getRol().toString());
            response.put("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." + usuarioCreado.getIdUsuario() + "." + System.currentTimeMillis());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String contrasena = request.get("contrasena");
            
            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Email requerido"));
            }
            if (contrasena == null || contrasena.isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Contraseña requerida"));
            }
            
            User usuario = userService.loginUser(email, contrasena);
            
            Map<String, Object> response = new HashMap<>();
            response.put("idUsuario", usuario.getIdUsuario());
            response.put("email", usuario.getEmail());
            response.put("nombreUsuario", usuario.getNombreUsuario());
            response.put("rol", usuario.getRol().toString());
            response.put("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." + usuario.getIdUsuario() + "." + System.currentTimeMillis());
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(createErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable Long id) {
        try {
            User usuario = userService.getUserById(id);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "ÉXITO");
            response.put("usuario", usuario);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        try {
            List<User> usuarios = userService.getAllUsers();
            Map<String, Object> response = new HashMap<>();
            response.put("status", "ÉXITO");
            response.put("cantidad", usuarios.size());
            response.put("usuarios", usuarios);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error: " + e.getMessage()));
        }
    }
    
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "ERROR");
        response.put("message", message);
        return response;
    }
}
