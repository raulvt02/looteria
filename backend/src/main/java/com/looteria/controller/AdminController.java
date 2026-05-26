package com.looteria.controller;

import com.looteria.dto.UserDTO;
import com.looteria.dto.AdminUserUpdateDTO;
import com.looteria.dto.ListingDetailDTO;
import com.looteria.service.UserService;
import com.looteria.service.ListingAdminService;
import com.looteria.service.TransactionService;
import com.looteria.service.ExchangeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private ListingAdminService listingAdminService;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private ExchangeService exchangeService;

    // ENDPOINTS USUARIOS

    /**
     * Obtener todos los usuarios
     */
    @GetMapping("/usuarios")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsersDTO();
        return ResponseEntity.ok(users);
    }

    /**
     * Obtener usuario por ID
     */
    @GetMapping("/usuarios/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        UserDTO user = userService.getUserByIdDTO(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    /**
     * Eliminar usuario
     */
    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Actualizar usuario desde el panel admin
     */
    @PutMapping("/usuarios/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody AdminUserUpdateDTO request) {
        try {
            UserDTO updatedUser = userService.updateUserAdmin(
                    id,
                    request.getEmail(),
                    request.getNombreUsuario(),
                    request.getRol(),
                    request.getUbicacion(),
                    request.getReputacionMedia(),
                    request.getVerificadoIdentidad()
            );
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("status", "ERROR");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    // ENDPOINTS PUBLICACIONES

    /**
     * Obtener todas las publicaciones
     */
    @GetMapping("/publicaciones")
    public ResponseEntity<List<ListingDetailDTO>> getAllListings() {
        List<ListingDetailDTO> listings = listingAdminService.getAllListingsForAdmin();
        return ResponseEntity.ok(listings);
    }

    /**
     * GET /admin/publicaciones/usuario/{userId} - Obtener publicaciones de un usuario
     */
    @GetMapping("/publicaciones/usuario/{userId}")
    public ResponseEntity<List<ListingDetailDTO>> getListingsByUser(@PathVariable Long userId) {
        List<ListingDetailDTO> listings = listingAdminService.getListingsByUserId(userId);
        return ResponseEntity.ok(listings);
    }

    /**
     * GET /admin/publicaciones/{id} - Obtener publicación por ID
     */
    @GetMapping("/publicaciones/{id}")
    public ResponseEntity<ListingDetailDTO> getListingById(@PathVariable Long id) {
        ListingDetailDTO listing = listingAdminService.getListingById(id);
        if (listing == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(listing);
    }

    /**
     * DELETE /admin/publicaciones/{id} - Eliminar publicación
     */
    @DeleteMapping("/publicaciones/{id}")
    public ResponseEntity<Void> deleteListing(@PathVariable Long id) {
        try {
            listingAdminService.deleteListing(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * DELETE /admin/transacciones/{id} - Eliminar transacción
     */
    @DeleteMapping("/transacciones/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        try {
            transactionService.deleteTransaction(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * DELETE /admin/intercambios/{id} - Eliminar intercambio
     */
    @DeleteMapping("/intercambios/{id}")
    public ResponseEntity<Void> deleteExchange(@PathVariable Long id) {
        try {
            exchangeService.deleteExchange(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
